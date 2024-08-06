// Initialize Supabase client
const supabaseUrl = 'https://dwcbvbpwkfmydeucsydj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI'; // Replace with your actual Supabase key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchAgentNames() {
    const { data, error } = await supabase
        .from('agent_names')
        .select('*');
    
    if (error) {
        console.error('Error fetching agent names:', error);
        return [];
    }
    return data;
}

async function fetchDepartments() {
    const { data, error } = await supabase
        .from('departments')
        .select('*');
    
    if (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
    return data;
}

async function fetchRegions(departmentId) {
    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('department_id', departmentId);
    
    if (error) {
        console.error('Error fetching regions:', error);
        return [];
    }
    return data;
}

async function fetchTasks() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*');
    
    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data;
}

async function populateDropdowns() {
    const agentNames = await fetchAgentNames();
    const agentNameDropdown = document.getElementById('agent-name');
    
    agentNames.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent.id;
        option.textContent = agent.name;
        agentNameDropdown.appendChild(option);
    });

    const departments = await fetchDepartments();
    const departmentDropdown = document.getElementById('working-department');
    
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        departmentDropdown.appendChild(option);
    });

    const tasks = await fetchTasks();
    const taskDropdown = document.getElementById('task');
    
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.name;
        taskDropdown.appendChild(option);
    });
}

document.getElementById('working-department').addEventListener('change', async (event) => {
    const departmentId = event.target.value;
    const regions = await fetchRegions(departmentId);
    const regionDropdown = document.getElementById('working-region');
    
    regionDropdown.innerHTML = '';
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.id;
        option.textContent = region.name;
        regionDropdown.appendChild(option);
    });

    regionDropdown.classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
});

document.getElementById('productivity-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const agentName = document.getElementById('agent-name').value;
    const workingDepartment = document.getElementById('working-department').value;
    const workingRegion = document.getElementById('working-region').value;
    const ticketNumber = document.getElementById('ticket-number').value;
    const taskDate = document.getElementById('task-date').value;
    const emailTime = document.getElementById('email-time').value;
    const task = document.getElementById('task').value;
    const timeTaken = document.getElementById('time-taken').value;
    const taskDetails = document.getElementById('task-details').value;

    const response = await supabase
        .from('productivity_data')
        .insert([
            {
                agent_name: agentName,
                working_department: workingDepartment,
                working_region: workingRegion,
                ticket_number: ticketNumber,
                task_date: taskDate,
                email_time: emailTime,
                task: task,
                time_taken: timeTaken,
                task_details: taskDetails
            }
        ]);

    if (response.error) {
        alert('Error submitting form: ' + response.error.message);
    } else {
        alert('Form submitted successfully');
        document.getElementById('productivity-form').reset();
    }
});
