import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load components
const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')
const RegistrationLayout = () => import('@/layouts/RegistrationLayout.vue')

// Auth pages
const Login = () => import('@/pages/auth/Login.vue')
const Register = () => import('@/pages/auth/Register.vue')
const ForgotPassword = () => import('@/pages/auth/ForgotPassword.vue')
const ResetPassword = () => import('@/pages/auth/ResetPassword.vue')

// Main pages
const Home = () => import('@/pages/Home.vue')

// Human pages
const HumanRegistration = () => import('@/pages/human/Registration.vue')
const HumanRegistrationSuccess = () => import('@/pages/human/RegistrationSuccess.vue')
const HumanDashboard = () => import('@/pages/human/Dashboard.vue')
const HumanProfile = () => import('@/pages/human/Profile.vue')
const HumanMyJobs = () => import('@/pages/human/MyJobs.vue')
const HumanMyContests = () => import('@/pages/human/MyContests.vue')
const HumanMyEvents = () => import('@/pages/human/MyEvents.vue')
const HumanPendingRequests = () => import('@/pages/human/PendingRequests.vue')
const HumanChildren = () => import('@/pages/human/Children.vue')

// Company pages
const CompanyRegistration = () => import('@/pages/company/Registration.vue')
const CompanyDashboard = () => import('@/pages/company/Dashboard.vue')
const CompanyProfile = () => import('@/pages/company/Profile.vue')
const CompanyTalents = () => import('@/pages/company/Talents.vue')
const CompanyConnections = () => import('@/pages/company/Connections.vue')
const CompanyJobs = () => import('@/pages/company/Jobs.vue')
const CompanyContests = () => import('@/pages/company/Contests.vue')
const CompanyEvents = () => import('@/pages/company/Events.vue')

// Job pages
const JobWall = () => import('@/pages/job/Wall.vue')
const JobDetails = () => import('@/pages/job/Details.vue')
const JobCreate = () => import('@/pages/job/Create.vue')
const JobEdit = () => import('@/pages/job/Edit.vue')

// Contest pages
const ContestList = () => import('@/pages/contest/List.vue')
const ContestDetails = () => import('@/pages/contest/Details.vue')
const ContestCreate = () => import('@/pages/contest/Create.vue')
const ContestParticipate = () => import('@/pages/contest/Participate.vue')

// Event pages
const EventCalendar = () => import('@/pages/event/Calendar.vue')
const EventDetails = () => import('@/pages/event/Details.vue')
const EventCreate = () => import('@/pages/event/Create.vue')

// Chat pages
const ChatView = () => import('@/pages/chat/ChatView.vue')

// Define routes
const routes: RouteRecordRaw[] = [
  // Auth routes (no authentication required)
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { guest: true },
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
        meta: { guest: true },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { guest: true },
      },
      {
        path: 'reset-password/:uid/:token',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: { guest: true },
      },
    ],
  },

  // Registration wizard routes
  {
    path: '/human/registration',
    component: RegistrationLayout,
    children: [
      {
        path: '',
        name: 'human-registration',
        component: HumanRegistration,
      },
      {
        path: 'success',
        name: 'registration-success',
        component: HumanRegistrationSuccess,
      },
    ],
  },
  {
    path: '/company/registration',
    component: RegistrationLayout,
    meta: { requiresAuth: true, accountType: 'humanize' },
    children: [
      {
        path: '',
        name: 'CompanyRegistration',
        component: CompanyRegistration,
      },
    ],
  },

  // Dashboard routes (authenticated)
  {
    path: '/app',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      
      // Human routes
      {
        path: 'human/dashboard',
        name: 'HumanDashboard',
        component: HumanDashboard,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/profile',
        name: 'HumanProfile',
        component: HumanProfile,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/my-jobs',
        name: 'HumanMyJobs',
        component: HumanMyJobs,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/my-contests',
        name: 'HumanMyContests',
        component: HumanMyContests,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/my-events',
        name: 'HumanMyEvents',
        component: HumanMyEvents,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/pending-requests',
        name: 'HumanPendingRequests',
        component: HumanPendingRequests,
        meta: { accountType: 'human' },
      },
      {
        path: 'human/children',
        name: 'HumanChildren',
        component: HumanChildren,
        meta: { accountType: 'human' },
      },

      // Company routes
      {
        path: 'company/dashboard',
        name: 'CompanyDashboard',
        component: CompanyDashboard,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/profile',
        name: 'CompanyProfile',
        component: CompanyProfile,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/talents',
        name: 'CompanyTalents',
        component: CompanyTalents,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/connections',
        name: 'CompanyConnections',
        component: CompanyConnections,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/jobs',
        name: 'CompanyJobs',
        component: CompanyJobs,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/contests',
        name: 'CompanyContests',
        component: CompanyContests,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'company/events',
        name: 'CompanyEvents',
        component: CompanyEvents,
        meta: { accountType: 'humanize' },
      },

      // Job routes
      {
        path: 'jobs',
        name: 'JobWall',
        component: JobWall,
      },
      {
        path: 'jobs/:id',
        name: 'JobDetails',
        component: JobDetails,
      },
      {
        path: 'jobs/create',
        name: 'JobCreate',
        component: JobCreate,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'jobs/:id/edit',
        name: 'JobEdit',
        component: JobEdit,
        meta: { accountType: 'humanize' },
      },

      // Contest routes
      {
        path: 'contests',
        name: 'ContestList',
        component: ContestList,
      },
      {
        path: 'contests/:id',
        name: 'ContestDetails',
        component: ContestDetails,
      },
      {
        path: 'contests/create',
        name: 'ContestCreate',
        component: ContestCreate,
        meta: { accountType: 'humanize' },
      },
      {
        path: 'contests/:id/participate',
        name: 'ContestParticipate',
        component: ContestParticipate,
        meta: { accountType: 'human' },
      },

      // Event routes
      {
        path: 'events',
        name: 'EventCalendar',
        component: EventCalendar,
      },
      {
        path: 'events/:id',
        name: 'EventDetails',
        component: EventDetails,
      },
      {
        path: 'events/create',
        name: 'EventCreate',
        component: EventCreate,
        meta: { accountType: 'humanize' },
      },

      // Chat routes
      {
        path: 'chat',
        name: 'Chat',
        component: ChatView,
      },
      {
        path: 'chat/:roomId',
        name: 'ChatRoom',
        component: ChatView,
      },
    ],
  },

  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth initialization
  await authStore.checkAuth()
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)
  const requiredAccountType = to.meta.accountType as string | undefined

  // Redirect authenticated users away from guest-only pages
  if (isGuestOnly && isAuthenticated) {
    const dashboard = authStore.isHuman ? '/app/human/dashboard' : '/app/company/dashboard'
    return next(dashboard)
  }

  // Redirect unauthenticated users to login
  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Check account type requirement
  if (requiredAccountType && isAuthenticated) {
    const userAccountType = authStore.accountType
    if (userAccountType !== requiredAccountType) {
      const dashboard = authStore.isHuman ? '/app/human/dashboard' : '/app/company/dashboard'
      return next(dashboard)
    }
  }

  next()
})

export default router
