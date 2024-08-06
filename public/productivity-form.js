document.addEventListener('DOMContentLoaded', () => {
    // Set the current date
    const taskDateInput = document.getElementById('task-date');
    const currentDate = new Date().toISOString().split('T')[0];
    taskDateInput.value = currentDate;

    // Example code for handling dynamic dropdowns (update based on actual requirements)
    const workingDepartmentSelect = document.getElementById('working-department');
    const workingRegionSelect = document.getElementById('working-region');
    const timeTakenInput = document.getElementById('time-taken');
    const taskDetailsInput = document.getElementById('task-details');

    workingDepartmentSelect.addEventListener('change', () => {
        // Show/hide working region dropdown based on selected department
        if (workingDepartmentSelect.value) {
            workingRegionSelect.classList.remove('hidden');
            // Update workingRegionSelect options based on department
        } else {
            workingRegionSelect.classList.add('hidden');
        }
    });

    // Example for showing/hiding timeTaken and taskDetails fields based on task selection
    document.getElementById('task').addEventListener('change', (event) => {
        const selectedTask = event.target.value;
        if (selectedTask === 'SpecificTask') { // Replace 'SpecificTask' with actual value
            timeTakenInput.classList.remove('hidden');
            taskDetailsInput.classList.remove('hidden');
        } else {
            timeTakenInput.classList.add('hidden');
            taskDetailsInput.classList.add('hidden');
        }
    });

    // Handle form submission
    document.getElementById('productivity-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/submit-productivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                event.target.reset();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Server error');
        }
    });
});
