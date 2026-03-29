import api from './api'

export const analyzeFeedback = (data) => api.post('/feedback/analyze', data)
export const submitFeedback = (data) => api.post('/feedback/submit', data)
export const getDashboard = (domain) => api.get('/feedback/dashboard', { params: { domain } })
export const getSuggestions = (domain) => api.get('/feedback/suggestions', { params: { domain } })
export const addSuggestion = (data) => api.post('/feedback/suggestions', data)
export const upvoteSuggestion = (id) => api.post(`/feedback/suggestions/${id}/upvote`)
export const getPolls = (domain) => api.get('/feedback/polls', { params: { domain } })
export const createPoll = (data) => api.post('/feedback/polls', data)
export const votePoll = (optionId) => api.post(`/feedback/polls/${optionId}/vote`)