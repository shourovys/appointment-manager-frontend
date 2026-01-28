import { http, HttpResponse } from 'msw';

// Use a mock URL for testing - this avoids needing real env vars
const MOCK_API_URL = 'http://localhost:3000/api';

export const handlers = [
  http.post(`${MOCK_API_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'mock-token',
      },
    });
  }),

  http.get(`${MOCK_API_URL}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
    });
  }),

  http.post(`${MOCK_API_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),
];
