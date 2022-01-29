export default function Filters(type) {
  return (
    <div>
      <form>
        <input type="text" className="form-control" placeholder="Department" />
        <input type="text" className="form-control" placeholder="Professor" />
        <input type="text" className="form-control" placeholder="Avg Hours" />
        <input type="text" className="form-control" placeholder="Max Hours" />
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" />
          <label className="form-check-label" for="flexSwitchCheckDefault">Same professor</label>
        </div>
      </form>
    </div>
  );
}