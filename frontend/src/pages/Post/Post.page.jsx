import DOMAIN from "../../services/endpoint";
import axios from "axios";
import { ArticleCardImage } from "../../components/misc/ArticleCardImage";
import { SimpleGrid, Container } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner"
import { useEffect, useState } from "react";

export const PostPage = () => {
  const posts = useLoaderData();
  //add loading state to the page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/api/posts`);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      {loading ? (
      <Spinner />

      ) : (
      <SimpleGrid cols={3}>
        {posts?.map((post) => (
          <ArticleCardImage key={post.title} {...post} />
        ))}
      </SimpleGrid>
      )}
    </Container>
  );
};


export const postsLoader = async () => {
  try {
  const res = await axios.get(`${DOMAIN}/api/posts`);
  return res.data;
  } catch (error) {
    console.log(error)
  }
};
