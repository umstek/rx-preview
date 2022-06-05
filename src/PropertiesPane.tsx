import { useLocation, useParams } from "react-router-dom";

export default function PropertiesPane() {
  const location = useLocation();

  return (
    <div>
      <pre>{JSON.stringify(location, null, 2)}</pre>
    </div>
  );
}
