import { NextPage } from 'next';
import Layout from '@/layouts';
import Names from '@/containers/Names';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Names />
    </Layout>
  );
};

export default HomePage;
