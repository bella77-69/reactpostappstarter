import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMAIN from "../../services/endpoint";
import axios from "axios";
import { Button, Container } from "@mantine/core";
import { Card, Image, Text, Group } from "@mantine/core";
import classes from "./PostDetailsPage.module.css";
import useBoundStore from "../../store/Store";

function PostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useBoundStore((state) => state);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/api/posts/${id}`);
        setPost(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading post details...</div>;
  }

  const { email, title, category, content, image, userId } = post;

  const truncatedEmail = email.split("@")[0];

  return (
    <>
      <Container>
        <div>
          <p>This page shows post details!</p>
          <Button mb="md">
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </div>
        <Card withBorder radius="md" p={0} className={classes.card}>
          <Group wrap="nowrap" gap={0}>
            <Image src={image} alt={title} height={160} />
            <div className={classes.body}>
              <Text tt="uppercase" c="dimmed" fw={700} size="xs">
                Author: {truncatedEmail}
              </Text>
              <Text className={classes.title} mt="xs">
                Title: {title}
              </Text>
              <Text className={classes.title} mt="xs" c="dimmed">
                Category: {category}
              </Text>
              <Group wrap="nowrap" gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <Text size="xs"> Content: {content}</Text>
                </Group>
                {user && user.id === userId && (
                  <Button>
                    <Link to={`/posts/edit/${id}`}>Edit</Link>
                  </Button>
                )}
              </Group>
            </div>
          </Group>
        </Card>
      </Container>
    </>
  );
}

export const postDetailsLoader = async ({ params }) => {
  const postId = params.id;
  try {
    const response = await axios.get(`${DOMAIN}/api/posts/${postId}`);
    return { post: response.data };
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
};

export default PostDetailsPage;
