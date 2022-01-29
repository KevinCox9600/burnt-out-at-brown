import Table from '../components/Table';
import Filters from '../components/Filters';

export default function Courses() {
  return (
    <main>
      <Filters type="courses" />
      <Table type="courses" />
    </main>
  );
}