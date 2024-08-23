from flask import Flask, render_template, request, send_file
import pandas as pd
import requests
from io import BytesIO

app = Flask(__name__)

# Google Sheets API Setup
GOOGLE_SHEETS_API_KEY = "AIzaSyBetGkBUBGg8vqxEYAnwm0FMXUCrole-xs"
SHEET_ID = "1QqxjcZj8YZWHNri6quC3Cu3uUo9pWrlP9P73k3oKUAM"

def fetch_google_sheet_data():
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/A1:I1000?key={GOOGLE_SHEETS_API_KEY}"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json().get('values', [])
    df = pd.DataFrame(data[1:], columns=data[0])
    return df

def filter_data(df, start_date, end_date, agent_name, working_department, working_region):
    if start_date:
        df = df[df['Task Date'] >= start_date]
    if end_date:
        df = df[df['Task Date'] <= end_date]
    if agent_name:
        df = df[df['Agent Name'] == agent_name]
    if working_department:
        df = df[df['Working Department'] == working_department]
    if working_region:
        df = df[df['Working Region'] == working_region]
    return df

def generate_excel_report(df_filtered):
    output = BytesIO()

    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Sheet 1: Report Summary
        summary = df_filtered.groupby(['Agent Name', 'Working Department', 'Working Region', 'Task Date']).agg(
            Total_Task_Time=pd.NamedAgg(column='Task Time', aggfunc=lambda x: pd.to_timedelta(x).sum()),
            Submission_Count=pd.NamedAgg(column='Ticket Number', aggfunc='count')
        ).reset_index()

        summary['Total Task Time'] = summary['Total_Task_Time'].dt.components.apply(
            lambda row: f"{int(row.hours)}:{int(row.minutes):02}", axis=1)
        summary.drop(columns=['Total_Task_Time'], inplace=True)

        summary.to_excel(writer, sheet_name="Report Summary", index=False)

        # Sheet 2: Raw Data
        df_filtered.to_excel(writer, sheet_name="Raw Data", index=False)

    output.seek(0)
    return output

@app.route('/')
def index():
    return render_template('report.html')

@app.route('/download_report', methods=['GET'])
def download_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    agent_name = request.args.get('agent_name')
    working_department = request.args.get('working_department')
    working_region = request.args.get('working_region')

    df = fetch_google_sheet_data()
    df_filtered = filter_data(df, start_date, end_date, agent_name, working_department, working_region)
    excel_output = generate_excel_report(df_filtered)

    return send_file(
        excel_output,
        as_attachment=True,
        download_name="report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

if __name__ == '__main__':
    app.run(debug=True)

