import { NextPage } from 'next';
import Layout from '@/layouts';
import Manage from '@/containers/Manage';

const SettingPage: NextPage = () => {
  return (
    <Layout>
      <Manage />
    </Layout>
  );
};

export default SettingPage;
