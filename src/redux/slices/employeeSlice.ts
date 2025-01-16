import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Employee {
  id: string; 
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  role: string;
  yearsOfExperience: number;
  salary: number;
  address: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  searchQuery: '',
};

// Fetch all employees
export const fetchEmployees = createAsyncThunk('employees/fetchAll', async () => {
  const response = await fetch('https://json-server-production-ac12.up.railway.app/employees');
  if (!response.ok) throw new Error('Failed to fetch employees');
  return await response.json();
});

// Add a new employee
export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employee: Omit<Employee, 'id'>) => {
    const response = await fetch('https://json-server-production-ac12.up.railway.app/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to add employee');
    return await response.json();
  }
);

// Update an employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: string; data: Omit<Employee , "id"> }) => {
    const response = await fetch(`https://json-server-production-ac12.up.railway.app/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return await response.json();
  }
);

// Delete an employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string) => {
    const response = await fetch(`https://json-server-production-ac12.up.railway.app/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return id;
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add employee';
      }).addCase(updateEmployee.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee =null;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      }).addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error Editing Employee!"
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setSelectedEmployee, clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
