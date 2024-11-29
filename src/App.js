import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const baseUrl = "http://localhost:5000/students";

function App() {
    const [students, setStudents] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [id, setId] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(baseUrl);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName || age <= 0) {
            return alert("All fields are required.");
        }

        const newStudent = { firstName, lastName, age };

        try {
            if (id) {
                await axios.put(`${baseUrl}/${id}`, newStudent);
            } else {
                await axios.post(baseUrl, newStudent);
            }
            fetchStudents();
            handleClear();
        } catch (error) {
            console.error("Error saving student:", error);
        }
    };

    const handleEdit = (student) => {
        setId(student.id);
        setFirstName(student.firstName);
        setLastName(student.lastName);
        setAge(student.age);
    };

    const handleDelete = async (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`${baseUrl}/${studentId}`);
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    const handleClear = () => {
        setId(null);
        setFirstName('');
        setLastName('');
        setAge('');
    };

    return (
        <div className="App">
            <h1>Student Management</h1>
            <div className="form">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <button onClick={handleSave}>{id ? "Update" : "Add"} Student</button>
                <button onClick={handleClear}>Clear</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.age}</td>
                            <td>
                                <button onClick={() => handleEdit(student)}>Edit</button>
                                <button onClick={() => handleDelete(student.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;

