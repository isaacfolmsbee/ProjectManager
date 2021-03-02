import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Dashboard',
		component: () => import('../views/Dashboard.vue'),
		meta: {
			requiresAuth: true,
			isUser: true,
		},
	},
	{
		path: '/tickets',
		name: 'Tickets',
		component: () => import('../views/Tickets.vue'),
		meta: {
			requiresAuth: true,
			isUser: true,
		},
	},
	{
		path: '/ticket',
		name: 'Ticket',
		component: () => import('../views/Ticket.vue'),
		meta: {
			requiresAuth: true,
			isUser: true,
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue'),
		meta: {
			guest: true,
		},
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('../views/Register.vue'),
		meta: {
			guest: true,
		},
	},
	// {
	// 	path: '/logout',
	// 	name: 'Logout',
	// 	component: () => import('../views/Logout.vue'),
	// 	meta: {
	// 		guest: true,
	// 	},
	// },
	// {
	// 	path: '/projects',
	// 	name: 'ProjectsManage',
	// 	component: () => import('../views/ProjectsManage.vue'),
	// 	meta: {
	// 		guest: true,
	// 	},
	// },
	// {
	// 	path: '/users',
	// 	name: 'Users',
	// 	component: () => import('../views/Users.vue'),
	// 	meta: {
	// 		requiresAuth: true,
	// 		isAdmin: true,
	// 	},
	// },
	// {
	// 	path: '/statistics',
	// 	name: 'Statistics',
	// 	component: () => import('../views/Statistics.vue'),
	// 	meta: {
	// 		requiresAuth: true,
	// 		isStatistics: true,
	// 	},
	// },
];

const router = new VueRouter({
	mode: 'hash',
	routes,
});

// router.beforeEach((to, from, next) => {
// 	const auth = sessionStorage.getItem('auth');
// 	const role = sessionStorage.getItem('role');

// 	if (to.meta.requiresAuth) {
// 		if (auth && role) {
// 			if (role === 'admin') {
// 				next();
// 			} else if (role === 'statistics') {
// 				if (to.meta.isStatistics) {
// 					next();
// 				} else {
// 					next('/statistics');
// 				}
// 			} else if (to.meta.isAdmin) {
// 				next('/');
// 			} else {
// 				next();
// 			}
// 		} else {
// 			next('/login');
// 		}
// 	} else {
// 		if (auth && role) {
// 			if (role === 'statistics') {
// 				next('/statistics');
// 			} else {
// 				next('/');
// 			}
// 		} else {
// 			next();
// 		}
// 	}

// 	// console.log('entering');
// 	// if (to.meta.requiresAuth) {
// 	// 	console.log('auth');
// 	// 	const auth = sessionStorage.getItem('auth');
// 	// 	const userStringified = sessionStorage.getItem('userPerms');
// 	// 	if (!auth || !userStringified) {
// 	// 		console.log('Nope!' + auth + userStringified);
// 	// 		next('/login');
// 	// 	} else if (to.meta.isAdmin) {
// 	// 		console.log('need admin');
// 	// 		const user = JSON.parse(userStringified);
// 	// 		if (user.isAdmin) {
// 	// 			next();
// 	// 		} else {
// 	// 			next('/');
// 	// 		}
// 	// 	} else if (to.meta.isUser) {
// 	// 		console.log('tis user');
// 	// 		const user = JSON.parse(userStringified);
// 	// 		let isUser = false;
// 	// 		for (const role of user.roles) {
// 	// 			if (role.role == 'user') {
// 	// 				isUser = true;
// 	// 			}
// 	// 		}

// 	// 		console.log('passed loop' + isUser);

// 	// 		if (isUser) {
// 	// 			next();
// 	// 		} else {
// 	// 			next('/login')
// 	// 		}
// 	// 	} else {
// 	// 		next();
// 	// 	}
// 	// } else if (to.meta.guest) {
// 	// 	if (sessionStorage.getItem('auth') == null) {
// 	// 		next();
// 	// 	} else {
// 	// 		next('/');
// 	// 	}
// 	// } else {
// 	// 	next();
// 	// }



// 	// if (to.matched.some((record) => record.meta.requiresAuth)) {
// 	// 	const userStringified = sessionStorage.getItem('userPerms');
// 	// 	if (sessionStorage.getItem('auth') == null || userStringified == null) {
// 	// 		next('/login');
// 	// 	} else {
// 	// 		const user = JSON.parse(userStringified);
// 	// 		if (to.matched.some((record) => record.meta.isAdmin)) {
// 	// 			if (user.isAdmin == 1) {
// 	// 				next();
// 	// 			} else {
// 	// 				next('/');
// 	// 			}
// 	// 		} else if (to.matched.some((record) => record.meta.isUser)) {
// 	// 			if (user.isAdmin == 1) {
// 	// 				next();
// 	// 			} else {
// 	// 				let isUser = false;

// 	// 				for (const role of user.roles) {
// 	// 					if (role.role === 'user') {
// 	// 						isUser = true;
// 	// 					}
// 	// 				}

// 	// 				if (isUser) {
// 	// 					next();
// 	// 				} else {
// 	// 					next('/');
// 	// 				}
// 	// 			}
// 	// 		} else {
// 	// 			next();
// 	// 		}
// 	// 	}
// 	// } else if (to.matched.some((record) => record.meta.guest)) {
// 	// 	if (sessionStorage.getItem('auth') == null) {
// 	// 		next();
// 	// 	} else {
// 	// 		next('/');
// 	// 	}
// 	// } else {
// 	// 	next();
// 	// }
// });

export default router;
