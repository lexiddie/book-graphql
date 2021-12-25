interface Route {
  name: string;
  link: string;
}

const routes: Route[] = [
  {
    name: 'Books',
    link: '/books'
  },
  {
    name: 'Authors',
    link: '/authors'
  }
];

export default routes;
