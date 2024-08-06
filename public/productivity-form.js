// Initialize Supabase at the very top of the file
const supabaseUrl = 'https://dwcbvbpwkfmydeucsydj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjg1NDY1MywiZXhwIjoyMDM4NDMwNjUzfQ.51c7anMSPbGU6MGpzUbJZz9rhorFNOFOxUCizY62l7M';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function populateDropdowns() {
    try {
        const { data: departments, error: departmentError } = await supabase
            .from('departments')
            .select('*');

        if (departmentError) {
            console.error('Error fetching departments:', departmentError);
            return;
        }

        const { data: regions, error: regionError } = await supabase
            .from('regions')
            .select('*');

        if (regionError) {
            console.error('Error fetching regions:', regionError);
            return;
        }

        const departmentSelect = document.getElementById('working-department');
        const regionSelect = document.getElementById('working-region');

        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.id;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.id;
            option.textContent = region.name;
            regionSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error populating dropdowns:', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await populateDropdowns();
});

const form = document.getElementById('productivity-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
        agentName: formData.get('agent-name'),
        workingDepartment: formData.get('working-department'),
        workingRegion: formData.get('working-region'),
        ticketNumber: formData.get('ticket-number'),
        taskDate: formData.get('task-date'),
        emailTime: formData.get('email-time'),
        task: formData.get('task'),
        timeTaken: formData.get('time-taken'),
        taskDetails: formData.get('task-details')
    };

    try {
        const response = await fetch('/submit-productivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Productivity data submitted successfully');
            form.reset();
        } else {
            const errorData = await response.json();
            alert(`Error submitting data: ${errorData.error}`);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('Error submitting form');
    }
});
