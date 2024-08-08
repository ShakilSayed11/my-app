const { createClient } = supabase;

// Create a single supabase client for interacting with your database
const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9zZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#productivity-form');
    if (!form) {
        console.error('Form element not found');
        return;
    }

    // Data for dropdowns
    const agents = [
        "Sahil Sanadi", "Nikhil Singh", "Junaid Qazi", "Irfan Qureshi", "Shruti Nambiar",
        "Amreen Shaikh", "Nasim Rahamathulla", "Megha Parit", "Bhushan Kisan", "Asra Peerzada",
        // ... (list continues)
        "Rina Maji", "Reena Fernandes", "Test user"
    ];

    const departments = {
        'Oxford Direct': ['RAVENSBOURNE - India', 'RAVENSBOURNE - South Asia', 'RAVENSBOURNE - Mena', 'RAVENSBOURNE - Cas', 'BPP Team', 'Interview', 'Notre Dame', 'Test Entry do not use it', 'UNDA', 'Birkbeck'],
        'Pathways': ['India', 'DMUIC', 'ENUIC', 'ICD', 'BUIC', 'UBIC', 'UGIC', 'OPIC', 'UKIC', 'North America', 'Cas Team', 'Interview', 'Credit Control', 'Pre-Arrival', 'Student Support Co-Ordinators']
    };

    const tasks = [
        "IQ Filling - 0:10", "Conditional offer letter - 0:25", "Reject Application - 0:15", "Course confirmation / Refusal copy request - 0:10", "Case Assessments / Change of course emails - 0:15",
        // ... (list continues)
    ];

    // Populate agents dropdown
    const agentNameDropdown = document.getElementById('agent-name');
    agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent;
        option.textContent = agent;
        agentNameDropdown.appendChild(option);
    });

    // Populate tasks dropdown
    const taskNameDropdown = document.getElementById('task-name');
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        taskNameDropdown.appendChild(option);
    });

    // Handle department selection change
    const departmentDropdown = document.getElementById('department');
    const regionDropdown = document.getElementById('region');

    departmentDropdown.addEventListener('change', () => {
        const selectedDepartment = departmentDropdown.value;
        const regions = departments[selectedDepartment] || [];

        // Clear the current options in the region dropdown
        regionDropdown.innerHTML = '<option value="" selected>Select</option>';

        // Populate the region dropdown with the relevant options
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionDropdown.appendChild(option);
        });
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            agent_name: formData.get('agent-name'),
            department: formData.get('department'),
            region: formData.get('region'),
            ticket_number: formData.get('ticket-number'),
            task_date: formData.get('task-date'),
            email_time: formData.get('email-time'),
            task_name: formData.get('task-name'),
            task_time: formData.get('task-time'),
            submission_time: new Date().toISOString()
        };

        const { error } = await supabase
            .from('productivity-data')
            .insert([data]);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully');
            form.reset();
        }
    });
});
