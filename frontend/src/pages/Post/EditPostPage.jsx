import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMAIN from "../../services/endpoint";
import axios from "axios";
import {
  Card,
  TextInput,
  Group,
  Image,
  Button,
  Container,
  Text,
} from "@mantine/core";
import classes from "./PostDetailsPage.module.css";
import { useForm } from "@mantine/form";

function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
  });
  const form = useForm({
    initialValues: {
      title: "",
      category: "",
      image: "",
      content: "",
    },
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        //get request to get post by id
        const response = await axios.get(`${DOMAIN}/api/posts/${id}`);
        //set the post state to the response data
        setPost(response.data);
        //set the formData state with post details to prefilled form inputs
        setFormData({
          title: response.data.title,
          category: response.data.category,
          image: response.data.image,
          content: response.data.content,
        });
      } catch (error) {
        //logg error if any
        console.error("Error fetching post details:", error);
      }
    };
    //call fetchPost function
    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    //get name and value from input
    const { name, value } = e.target;
    //update the formData state
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`${DOMAIN}/api/posts/${id}`, formData);
      console.log("Post updated successfully:", response.data);
      //success stat set to true to display success message
      setSuccess(true);
      //hide success message after 3 seconds then navigate back to post details page
      setTimeout(() => {
        setSuccess(false);
        navigate(`/posts/${id}`);
      }, 3000);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (!post) {
    return <div>Loading post details...</div>;
  }

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleUpdatePost)}>
        <div>
          <p>Edit post</p>
          <Button mb="md">
            <Link to={`/posts/${id}`}>Back to Post Details</Link>
          </Button>
        </div>
        <Card withBorder radius="md" p={0} className={classes.card}>
          <Group wrap="nowrap" gap={0}>
            <Image src={post.image} alt={post.title} height={160} />
            <div className={classes.body}>
              <TextInput
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Image URL"
                className={classes.input}
              />
              <TextInput
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className={classes.input}
              />
              <TextInput
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category"
                className={classes.input}
              />
              <TextInput
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Content"
                className={classes.input}
              />
              <Button type="submit" className={classes.btn}>
                Update
              </Button>
              {success && (
                <Text color="green" mt={10}>
                  Post updated successfully!
                </Text>
              )}
            </div>
          </Group>
        </Card>
      </form>
    </Container>
  );
}

export default EditPostPage;
