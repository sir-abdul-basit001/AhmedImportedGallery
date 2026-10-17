import ResourceManager from "../../Components/ResourceManager.jsx";
import Img from "../../Components/Img.jsx";

const fields = [{ name: "image", label: "Photo", type: "image" }, { name: "caption", label: "Caption" }];
const columns = [{ label: "Photo", render: (r) => <Img src={r.image} alt="" className="size-14 rounded-lg object-cover" /> }, { label: "Caption", render: (r) => r.caption }];

export default function AdminGallery() {
  return <ResourceManager title="Gallery" noun="photo" endpoint="/api/gallery" fields={fields} columns={columns} />;
}
