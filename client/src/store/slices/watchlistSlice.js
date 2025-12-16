import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getWatchlists = createAsyncThunk('watchlists/getAll', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/watchlists');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createWatchlist = createAsyncThunk('watchlists/create', async (name, { rejectWithValue }) => {
    try {
        const res = await api.post('/watchlists', { name });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteWatchlist = createAsyncThunk('watchlists/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/watchlists/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const addItem = createAsyncThunk('watchlists/addItem', async ({ id, item }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/watchlists/${id}/items`, item);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const removeItem = createAsyncThunk('watchlists/removeItem', async ({ id, itemId }, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/watchlists/${id}/items/${itemId}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const watchlistSlice = createSlice({
    name: 'watchlists',
    initialState: {
        watchlists: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWatchlists.pending, (state) => { state.loading = true; })
            .addCase(getWatchlists.fulfilled, (state, action) => {
                state.loading = false;
                state.watchlists = action.payload;
            })
            .addCase(getWatchlists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createWatchlist.fulfilled, (state, action) => {
                state.watchlists.unshift(action.payload);
            })
            .addCase(deleteWatchlist.fulfilled, (state, action) => {
                state.watchlists = state.watchlists.filter(w => w._id !== action.payload);
            })
            .addCase(addItem.fulfilled, (state, action) => {
                const index = state.watchlists.findIndex(w => w._id === action.payload._id);
                if (index !== -1) state.watchlists[index] = action.payload;
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                const index = state.watchlists.findIndex(w => w._id === action.payload._id);
                if (index !== -1) state.watchlists[index] = action.payload;
            });
    }
});

export default watchlistSlice.reducer;
