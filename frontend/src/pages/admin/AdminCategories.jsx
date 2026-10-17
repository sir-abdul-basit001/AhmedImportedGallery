import ResourceManager from "../../Components/ResourceManager.jsx";
import Img from "../../Components/Img.jsx";

const fields = [{ name: "name", label: "Name", required: true }, { name: "image", label: "Image", type: "image" }];
const columns = [{ label: "Image", render: (r) => <Img src={r.image} alt="" className="size-14 rounded-lg object-cover" /> }, { label: "Name", render: (r) => r.name }];

export default function AdminCategories() {
  return <ResourceManager title="Categories" noun="category" endpoint="/api/categories" fields={fields} columns={columns} />;
}
