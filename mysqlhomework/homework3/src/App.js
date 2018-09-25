import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      isNewStudentDisplay: false,
      newName: "",
      newStudentId: "",
      newDepartment: ""
    };
  }

  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );

    axios
      .get("/api/students")
      .then(res => {
        let students = res.data.filter(std => std.isDeleted !== 1);

        this.setState({ students });
        console.log(this.state.students);
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  }

  logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  deleteHandler = student => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );

    const data = {
      studentId: student.studentId
    };
    axios
      .put("/api/students", data)
      .then(res => {
        console.log("Before set: " + res.data.studentId);
        const students = this.state.students.filter(
          student => student.studentId !== res.data.studentId
        );
        this.setState({ students: students });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  };

  addNewStudent = () => {
    const isNewStudentDisplay = !this.state.isNewStudentDisplay;
    this.setState({ isNewStudentDisplay });
    console.log(this.state.isNewStudentDisplay);
  };

  createHandler = () => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    const data = {
      studentId: this.state.newStudentId,
      full_name: this.state.newName,
      department: this.state.newDepartment
    };
    console.log(data);
    axios
      .post("/api/students", data)
      .then(res => {
        let students = this.state.students;
        students.push(res.data);
        this.setState({ students: students, isNewStudentDisplay: false });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  };

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  render() {
    const { newStudentId, newName, newDepartment } = this.state;
    return (
      <div class="container">
        {!this.state.isNewStudentDisplay && (
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                STUDENT REPORT &nbsp;
                {localStorage.getItem("jwtToken") && (
                  <button class="btn btn-primary" onClick={this.logout}>
                    Logout
                  </button>
                )}{" "}
                &nbsp; &nbsp; &nbsp;
                {localStorage.getItem("jwtToken") && (
                  <button class="btn btn-primary" onClick={this.addNewStudent}>
                    New Student
                  </button>
                )}
              </h3>
            </div>
            <div class="panel-body">
              <table class="table table-stripe">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.students.map(student => (
                    <tr>
                      <td>{student.studentId}</td>
                      <td>{student.full_name}</td>
                      <td>{student.department}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.deleteHandler(student)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {this.state.isNewStudentDisplay && (
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                ADD NEW STUDENT &nbsp;
                {localStorage.getItem("jwtToken") && (
                  <button class="btn btn-primary" onClick={this.logout}>
                    Logout
                  </button>
                )}{" "}
                &nbsp; &nbsp; &nbsp;
                {localStorage.getItem("jwtToken") && (
                  <button class="btn btn-primary" onClick={this.addNewStudent}>
                    Student Dashboard
                  </button>
                )}
              </h3>
            </div>
            <div class="panel-body">
              <div>
                <input
                  type="text"
                  name="newStudentId"
                  placeholder="Student ID"
                  value={newStudentId}
                  onChange={this.onChange}
                  required
                />
              </div>
              <br />
              <div>
                <input
                  type="text"
                  name="newName"
                  placeholder="Student Name"
                  value={newName}
                  onChange={this.onChange}
                  required
                />
              </div>
              <br />
              <div>
                <input
                  type="text"
                  name="newDepartment"
                  placeholder="Department"
                  value={newDepartment}
                  onChange={this.onChange}
                  required
                />
              </div>
              <br />
              <div>
                <button
                  class="btn btn-success"
                  onClick={() => this.createHandler()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
