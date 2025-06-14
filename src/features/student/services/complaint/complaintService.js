import api from '../../../../services/api';

const getComplaints = async () => {
    const response = await api.get('/v1/student/complaints');
    return response.data;
};

const getComplaintDetail = async (id) => {
    const response = await api.get(`/v1/student/complaints/${id}`);
    return response.data;
};

const createComplaint = async (data) => {
    const response = await api.post('/v1/student/complaints', data);
    return response.data;
};

export {
    getComplaints,
    getComplaintDetail,
    createComplaint
}; 
 