import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../redux/slices/employeeSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';

interface Employee {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  role: string;
  yearsOfExperience: string;
  salary: string;
  address: string;
}

const AddEmployee = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedEmployee, loading } = useSelector((state: RootState) => state.employee);
  const [formData, setFormData] = useState<Employee>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    role: '',
    yearsOfExperience: '',
    salary: '',
    address: '',
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        age: String(selectedEmployee.age),
        gender: selectedEmployee.gender,
        role: selectedEmployee.role,
        yearsOfExperience: String(selectedEmployee.yearsOfExperience),
        salary: String(selectedEmployee.salary),
        address: selectedEmployee.address,
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFakerData = () => {
    setFormData({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 65 }).toString(),
      gender: faker.helpers.arrayElement(['Male', 'Female']),
      role: faker.person.jobTitle(),
      yearsOfExperience: faker.number.int({ min: 0, max: 40 }).toString(),
      salary: faker.number.int({ min: 10000, max: 1000000 }).toString(),
      address: faker.location.streetAddress(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      await dispatch(
        updateEmployee({
          id: selectedEmployee.id,
          data: {
            ...formData,
            age: Number(formData.age),
            salary: Number(formData.salary),
            yearsOfExperience: Number(formData.yearsOfExperience),
          },
        })
      );
    } else {
      dispatch(
        addEmployee({
          ...formData,
          age: Number(formData.age),
          salary: Number(formData.salary),
          yearsOfExperience: Number(formData.yearsOfExperience),
        })
      );
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        role: '',
        yearsOfExperience: '',
        salary: '',
        address: '',
      });
    }

    const userChoice = window.confirm(
      `${selectedEmployee ? 'Employee updated successfully!' : 'Employee added successfully!'}\n\nDo you want to add more employees? Click "Cancel" to go to the dashboard.`
    );

    if (!userChoice) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold mb-4">{!selectedEmployee ? 'Add Employee' : 'Edit Employee'}</h2>
    { !selectedEmployee &&   <button
          type="button"
          onClick={handleFakerData}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Generate Faker Data
        </button>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            min={18}
            max={65}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            maxLength={100}
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            min={0}
            max={40}
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            min={10000}
            max={10000000}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            maxLength={500}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            {!selectedEmployee ? 'Add Employee' : loading ? 'Editing...' : 'Edit Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
