document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#productivity-form');

    // Initialize Supabase client
    const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

    // Data for dropdowns
    const agents = [
        "Sahil Sanadi", "Nikhil Singh", "Junaid Qazi", "Irfan Qureshi", "Shruti Nambiar",
        "Amreen Shaikh", "Nasim Rahamathulla", "Megha Parit", "Bhushan Kisan", "Asra Peerzada",
        "Gaurav Raghani", "Joyce Nadar", "Hussain Ansari", "Omkar Pedhe", "Anas Ansari",
        "Dhanashree Jayakar", "Macklin Rodrigues", "Mohsin Master", "Tasneem Sudanwala", "Aasiya Shaikh",
        "Natasha Reddymalla", "Anam Siddiqui", "Naziya Baig", "Dikshita Rajpurohit", "Umaira Qureshi",
        "Varsha Soman", "Rutuja Parab", "Suvarna Nikam", "Vaishnudeva Thevar", "Shila Gholap",
        "Safina Khan", "Vikash Patel", "Minal Mota", "Rishabh Besare", "Ritika Singh",
        "Mayur Yashwantrao", "Saramma Hargal", "Mandar Naik", "Prashant Bhanushali", "Diksha Bhonsle",
        "Muskan Sayyed", "Sana F Shaikh", "Ishika Singh", "Zeha Shaikh", "Pradyut Modak",
        "Anisa Mansuri", "Neha Momin", "Sagar Prasad", "Swapnil Gaikwad", "Alfiya Shaikh",
        "Mamta Patel", "Laxmi Yadav", "Pawan Shelar", "Rumaiza Shaikh", "Laibah Mehdi",
        "Vaibhav Sawant", "Sadafnaaz Shaikh", "Labeeb Rashidee", "Deepali Kanojiya", "Ashwini Gawli",
        "Altamash Khan", "Kirtika Ruprel", "Bhakti Patel", "Neha Sharma", "Nitin Divate",
        "Aliza Qadri", "Nisha Modak", "Sharib Khan", "Raina Chauhan", "Samir Sayyad",
        "Shahbaaz Shaikh", "Pratibha Chauhan", "Varsha Lal", "Saqlain Mom", "Tejal More",
        "Sumit Funde", "Aniket Kotnis", "Hemant Koyande", "Rashmi Bhanawat", "Bhargavi Waghela",
        "Annam Shaikh", "Viral Ved", "Monish Asthana", "Fahad Shaikh", "Arahan Dhanoriaa",
        "Shivam Upadhayay", "Ajit Gadiyal", "Purvi Nandu", "Ablena Mysa", "Mohammed Jariwala",
        "Silvi Fernandis", "Deepali Thapa", "Johnson Yalsatty", "Sophia Mckoy", "Priya Sinha",
        "Sonia Saxena", "Neha Ghosh", "Ganesh Diti", "Hemali Ramani", "Pallavi Navale",
        "Vivek Rachal", "Sonu Dhakre", "Abdullah Shaikh", "Mamta Mishra", "Akash Mishra",
        "Muskan Khan", "Payal Maji", "Afsar Shaikh", "Kshitij Nair", "Jessica Noronha",
        "Gurpreet Singh", "Sinaf Khatib", "Reefath Shaikh", "Divya Sansare", "Adarsh Vishwakarma",
        "Yogesh Sharma", "Shraddha Malandkar", "Sagar Wankhede", "Sangita Shiju", "Abhijeet Chaudhary",
        "Neha Chaube", "Khushi Sharma", "Taniya Khan", "Nilesh Shetty", "Mohd. Bijapur",
        "Akanksha Bankar", "Laxmi Tathi", "Rohit Pal", "Irshad Shaikh", "Kritika Dutta",
        "Saurabh Upadhyay", "Amaan Shaikh", "Ajay Solanki", "Tanzim Shaikh", "Rushikesh Patil",
        "Faeem Shaikh", "Priyanka Dicholkar", "Faisal Khan", "Asma Shaikh", "Zeenat Ansari",
        "Celeste Swamy", "Gulrez Ahmad", "Mohit Valmiki", "Ankita Jadhav", "Zain Nasib",
        "Jiveeta Kadam", "Aniket Chindaliya", "Aarohi Javeri", "Harsha Gehani", "Samreen Shaikh",
        "Sheetal Sharma", "Ahmed Sarkhot", "Prajakta Ubale", "Akash Parekh", "Sylvester Fernandes",
        "Ayesha Khan", "Parikshit Thaker", "Jyoti Malwad", "Bhagyashri Jaiswal", "Shruthi P",
        "Saba Shaikh", "Sweety Thakur", "Mohd Qasim", "Kahef Khan", "Shalini Jadhav",
        "Mayur Karkera", "Rina Maji", "Reena Fernandes", "Test user"
    ];

    const departments = {
        'Oxford Direct': ['RAVENSBOURNE - India', 'RAVENSBOURNE - South Asia', 'RAVENSBOURNE - Mena', 'RAVENSBOURNE - Cas', 'BPP Team', 'Interview', 'Notre Dame', 'Test Entry do not use it', 'UNDA', 'Birkbeck'],
        'Pathways': ['India', 'DMUIC', 'ENUIC', 'ICD', 'BUIC', 'UBIC', 'UGIC', 'OPIC', 'UKIC', 'North America', 'Cas Team', 'Interview', 'Credit Control', 'Pre-Arrival', 'Student Support Co-Ordinators']
    };

    const tasks = [
        "IQ Filling - 0:10", "Conditional offer letter - 0:25", "Reject Application - 0:15", "Course confirmation / Refusal copy request - 0:10", "Case Assessments / Change of course emails - 0:15",
        "Change of agent - 0:10", "Deferral Request - 0:20", "UO/CAS Incomplete stage - 0:15", "Detailed Email reply - 0:10", "Interview Schedule Request/Confirmation - 0:07",
        "UO Request (Complete) DMUIC/ UBIC / OIPC / SFSU / ICD - 0:25", "UO Request (Complete) BUIC / UGIC - 0:30", "CAS Request Incomplete - 0:15", "CAS Request complete - 0:30",
        "Deferred UO Request - 0:20", "Issuing UO Letter - 0:10", "Review CAS letter - 0:10", "Save Visa Copy - 0:05", "Credibility interview - 0:45", "Introductory call - 0:10",
        "Introductory call (NR contacts) - 0:02", "Offer/mails Review - 0:10", "UO/CAS Review - 0:15", "Onshore Apps/Emails - 0:03", "Team Call - 0:30", "Interview Review - 0:25",
        "BPP SOP Review - 0:25", "Unsuccessful Interview - 0:15", "Mercy GPA Checks - 0:20", "Pal Sop - 0:25", "Pal Completed - 0:20", "Pending document - 0:15", "Training By Trainer",
        "Task assigned by TL / Manager", "Test Entry do not use it"
    ];

    // Fill agents dropdown
    const agentSelect = document.querySelector('#agent-name');
    if (agentSelect) {
        agents.forEach(agent => {
            const option = document.createElement('option');
            option.value = agent;
            option.textContent = agent;
            agentSelect.appendChild(option);
        });
    } else {
        console.error('Agent select element not found');
    }

    // Fill departments dropdown
    const departmentSelect = document.querySelector('#department');
    if (departmentSelect) {
        Object.keys(departments).forEach(department => {
            const option = document.createElement('option');
            option.value = department;
            option.textContent = department;
            departmentSelect.appendChild(option);
        });
    } else {
        console.error('Department select element not found');
    }

    // Fill tasks dropdown
    const taskSelect = document.querySelector('#task-name');
    if (taskSelect) {
        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task;
            option.textContent = task;
            taskSelect.appendChild(option);
        });
    } else {
        console.error('Task select element not found');
    }

    // Fill regions dropdown based on department selection
    if (departmentSelect) {
        departmentSelect.addEventListener('change', function () {
            const regionSelect = document.querySelector('#region');
            const selectedDepartment = this.value;

            if (regionSelect) {
                // Clear previous options
                regionSelect.innerHTML = '<option value="" selected>Select</option>';

                if (departments[selectedDepartment]) {
                    departments[selectedDepartment].forEach(region => {
                        const option = document.createElement('option');
                        option.value = region;
                        option.textContent = region;
                        regionSelect.appendChild(option);
                    });
                }
            } else {
                console.error('Region select element not found');
            }
        });
    }

    // Set current date for Task Date field
    const taskDateInput = document.querySelector('#task-date');
    if (taskDateInput) {
        taskDateInput.value = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        taskDateInput.setAttribute('readonly', true);
    } else {
        console.error('Task date input element not found');
    }

    // Email Time input validation
    const emailTimeInput = document.querySelector('#email-time');
    if (emailTimeInput) {
        emailTimeInput.addEventListener('input', function (e) {
            const value = e.target.value;
            if (!/^\d{2}:\d{2}$/.test(value)) {
                e.target.value = value.slice(0, -1); // Remove last character if invalid
            }
        });
    } else {
        console.error('Email time input element not found');
    }

    // Form submission handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form fields
        const agentNameEl = document.querySelector('#agent-name');
        const departmentEl = document.querySelector('#department');
        const regionEl = document.querySelector('#region');
        const ticketNumberEl = document.querySelector('#ticket-number');
        const taskDateEl = document.querySelector('#task-date');
        const emailTimeEl = document.querySelector('#email-time');
        const taskNameEl = document.querySelector('#task-name');
        const taskTimeEl = document.querySelector('#task-time');

        // Check if elements exist
        if (!agentNameEl || !departmentEl || !regionEl || !ticketNumberEl || !taskDateEl || !emailTimeEl || !taskNameEl || !taskTimeEl) {
            console.error('One or more form elements are missing.');
            alert('Form elements are missing. Please check the HTML.');
            return;
        }

        const agentName = agentNameEl.value;
        const department = departmentEl.value;
        const region = regionEl.value;
        const ticketNumber = ticketNumberEl.value;
        const taskDate = taskDateEl.value;
        const emailTime = emailTimeEl.value;
        const taskName = taskNameEl.value;
        const taskTime = taskTimeEl.value;

        // Validate all required fields
        if (!agentName || !department || !region || !ticketNumber || !taskDate || !emailTime || !taskName || !taskTime) {
            alert('Please fill out all required fields.');
            return;
        }

        // Validate Ticket Number (must be 6 digits)
        if (!/^\d{6}$/.test(ticketNumber)) {
            alert('Ticket Number must be exactly 6 digits.');
            return;
        }

        // Get current submission time
        const submissionTime = new Date().toLocaleTimeString();

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('productivity-data')
            .insert([
                {
                    'Agent Name': agentName,
                    'Working Department': department,
                    'Working Region': region,
                    'Ticket Number': ticketNumber,
                    'Task Date': taskDate,
                    'Email Time': emailTime,
                    'Task Name': taskName,
                    'Task Time': taskTime,
                    'Submission Time': submissionTime
                }
            ]);

        if (error) {
            console.error('Error inserting data:', error);
            alert('Error submitting form. Please try again.');
        } else {
            alert('Form submitted successfully!');
            form.reset();
            document.querySelector('#region').innerHTML = '<option value="" selected>Select</option>'; // Reset regions dropdown
        }
    });
});
