import Table from '../components/Table';
import Filters from '../components/Filters';

export default function Profs() {
  return (
    <main>
      <Filters type="profs" />
      <Table type="profs" />
    </main>
  );
}