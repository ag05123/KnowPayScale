import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// This thunk will call your FastAPI backend
export const fetchSalary = createAsyncThunk(
  'salary/fetchSalary',
  async (jobDetails, { rejectWithValue }) => {
    try {
      // NOTE: You must replace this with your deployed API URL
      const response = await fetch('http://127.0.0.1:8000/api/v1/salary/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'API error');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  data: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSalary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSalary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default salarySlice.reducer;