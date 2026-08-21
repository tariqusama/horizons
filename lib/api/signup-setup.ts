import api from '../api';

export interface SignupGoal {
    id: number;
    title: string;
    image_url: string | null;
    order_index: number;
    default_service_id?: number | null;
    questions?: SignupQuestion[];
}

export interface SignupQuestion {
    id: number;
    signup_goal_id: number;
    question_text: string;
    depends_on_answer?: string | null;
    options: any[] | null;
    disqualifying_options: string[] | null;
    skip_to_end_options: string[] | null;
    service_mappings?: Record<string, number> | null;
    order_index: number;
}

export interface Service {
    id: number;
    title: string;
}

export const getServices = async (): Promise<Service[]> => {
    const res = await api.get('/services');
    return res.data;
};

export const getSignupGoals = async (): Promise<SignupGoal[]> => {
    const res = await api.get('/admin/signup-goals');
    return res.data;
};

export const createSignupGoal = async (data: Partial<SignupGoal>): Promise<SignupGoal> => {
    const res = await api.post('/admin/signup-goals', data);
    return res.data.goal;
};

export const updateSignupGoal = async (id: number, data: Partial<SignupGoal>): Promise<SignupGoal> => {
    const res = await api.put(`/admin/signup-goals/${id}`, data);
    return res.data.goal;
};

export const deleteSignupGoal = async (id: number): Promise<void> => {
    await api.delete(`/admin/signup-goals/${id}`);
};

export const createSignupQuestion = async (goalId: number, data: Partial<SignupQuestion>): Promise<SignupQuestion> => {
    const res = await api.post(`/admin/signup-goals/${goalId}/questions`, data);
    return res.data.question;
};

export const updateSignupQuestion = async (id: number, data: Partial<SignupQuestion>): Promise<SignupQuestion> => {
    const res = await api.put(`/admin/signup-questions/${id}`, data);
    return res.data.question;
};

export const deleteSignupQuestion = async (id: number): Promise<void> => {
    await api.delete(`/admin/signup-questions/${id}`);
};
