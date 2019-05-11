import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'
import NewGame from '@/pages/NewGame.vue'
import UserProfile from '@/pages/UserProfile.vue'
import TableList from '@/pages/TableList.vue'
import Typography from '@/pages/Typography.vue'
import Notifications from '@/pages/Notifications.vue'
import Inicio from '@/pages/Login.vue'
import Registro from '@/pages/Signin.vue'
import VistaProfile from '@/pages/VistaProfile.vue'
import Tienda from '@/pages/Tienda.vue'
const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/newgame',
    children: [
      {
        path: 'newgame',
        name: 'Nueva Partida',
        component: NewGame
      },
      {
        path: 'login',
        name: 'Login',
        component: Inicio,
        meta: {
          guest: true
        }
      },
      {
        path: 'signin',
        name: 'Registro',
        component: Registro,
        meta: {
          guest: true
        }
      },
      {
        path: 'user',
        name: 'Perfil usuario',
        component: UserProfile
      },
      {
        path: 'perfil',
        name: 'Vista Perfil',
        component: VistaProfile
      },
      {
        path: 'ranking',
        name: 'Lista Ranking',
        component: TableList,
        meta: {
          guest: true
        }
      },
      {
        path: 'shop',
        name: 'Tienda',
        component: Tienda
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      }
    ]
  }
]

export default routes
