/*ApplicantList is a React component that displays a searchable and sort-able local storage list of tutor applicants. 
Users can filter applicants based on name, course, availability, or skills, or sort the applicants by course or availability.
*/


import React, { useEffect, useState } from "react";


//  Defining the structure of an applicants data
interface Applicant {
  name: string;
  email: string;
  course: string;
  role: string;
  previousRoles: string;
  availability: string;
  skills: string;
  credentials: string;
}

//this is the main component for displaying the list of appplicants
const ApplicantList: React.FC = () => {
  //storing all applicants from localstorage
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  //storing the filtered list based on search
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);

  //storing the values from the search fields
  const [search, setSearch] = useState({
    name: "",
    course: "",
    availability: "",
    skills: "",
  });

  //storing the fields to sort by
  const [sortField, setSortField] = useState<"" | "course" | "availability">("");


  //load data from localstorage once the component mounts
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tutorApplications") || "[]");
    setApplicants(stored);
    setFilteredApplicants(stored); 
  }, []);


  //handling user typing in any of the search boxes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newSearch = { ...search, [name]: value };  //updating the relevant fields
    setSearch(newSearch);


    //filtering applicants based on the search input
    const filtered = applicants.filter((app) =>
      app.name.toLowerCase().includes(newSearch.name.toLowerCase()) &&
      app.course.toLowerCase().includes(newSearch.course.toLowerCase()) &&
      app.availability.toLowerCase().includes(newSearch.availability.toLowerCase()) &&
      app.skills.toLowerCase().includes(newSearch.skills.toLowerCase())
    );
    setFilteredApplicants(filtered);
  };


  //sort the filtered applicants based on selected field
  const handleSort = (field: "course" | "availability") => {
    setSortField(field);
    const sorted = [...filteredApplicants].sort((a, b) => a[field].localeCompare(b[field]));
    setFilteredApplicants(sorted);
  };


  
  const formatSkills = (skills: string | string[]) => {
    if (Array.isArray(skills)) {
      return skills.join(", ");
    } else if (typeof skills === "string") {
      try {
        
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) return parsed.join(", ");
        return skills.replace(/([a-z])([A-Z])/g, "$1, $2"); // Format camelCase skills with proper spacing
      } catch {
        return skills.replace(/([a-z])([A-Z])/g, "$1, $2"); // fallback: split camelCase-like issues
      }
    }
    return "";
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg mt-8 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Applicants List</h2>

      {/* search fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={search.name}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="course"
          placeholder="Search by course"
          value={search.course}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="availability"
          placeholder="Search by availability"
          value={search.availability}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="skills"
          placeholder="Search by skills"
          value={search.skills}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
      </div>

      {/* sort button */}
      <div className="mb-4 flex gap-4">
        <button onClick={() => handleSort("course")} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Sort by Course
        </button>
        <button onClick={() => handleSort("availability")} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Sort by Availability
        </button>
      </div>

      {/*showing the table only if there are applicants*/}
      {filteredApplicants.length > 0 ? (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Availability</th>
              <th className="border p-2">Skills</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant, index) => (
              <tr key={index}>
                <td className="border p-2">{applicant.name}</td>
                <td className="border p-2">{applicant.email}</td>
                <td className="border p-2">{applicant.course}</td>
                <td className="border p-2">{applicant.availability}</td>
                <td className="border p-2">{formatSkills(applicant.skills)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : 
      (
        //displaying the message when no results match the search
        <p className="text-center text-gray-600">No matching applicants found.</p>
      )}
    </div>
  );
};

export default ApplicantList;
