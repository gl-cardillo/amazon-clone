import { useForm } from "react-hook-form";
import axios from "axios";

export default function form() {
  const { register, handleSubmit, reset } = useForm();
  const post = async (data) => {
    await axios.post(" http://localhost:3000/api/product", data);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(post)}>
      <input type="text" id="name" {...register("name")} placeholder="name" />
      <input
        type="text"
        id="description"
        {...register("description")}
        placeholder="description"
      />
      <input
        type="text"
        id="description2"
        {...register("description2")}
        placeholder="description2"
      />
      <input
        type="text"
        id="description3"
        {...register("description3")}
        placeholder="description3"
      />
      <input
        type="text"
        id="manufacturer"
        {...register("manufacturer")}
        placeholder="manufacturer"
      />
      <input
        type="text"
        id="picUrl2"
        {...register("picUrl2")}
        placeholder="picUrl2"
      />
      <input
        type="text"
        id="picUrl3"
        {...register("picUrl3")}
        placeholder="picUrl3"
      />
      <input
        type="text"
        id="picUrl"
        {...register("picUrl")}
        placeholder="picUrl"
      />
      <input type="number" id="price" {...register("price")} step="0.01" />
      <input
        type="text"
        id="categoryId"
        placeholder="categoryId"
        {...register("categoryId")}
      />
      <input
        type="text"
        id="categoryName"
        placeholder="categoryName"
        {...register("categoryName")}
      />
      <input
        type="text"
        id="subcategory"
        {...register("subcategory")}
        placeholder="subcategory"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
