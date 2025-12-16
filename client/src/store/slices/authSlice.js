import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/auth/me');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.user = null;
                // state.error = action.payload; // Don't set error on loadUser fail (just not logged in)
            })
            .addCase(register.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
