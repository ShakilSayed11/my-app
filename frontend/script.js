document.getElementById('download-report').addEventListener('click', function () {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const agentName = document.getElementById('agent-name').value;
    const workingDepartment = document.getElementById('working-department').value;
    const workingRegion = document.getElementById('working-region').value;

    const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        agent_name: agentName,
        working_department: workingDepartment,
        working_region: workingRegion
    });

    window.location.href = `/download_report?${queryParams.toString()}`;
});

