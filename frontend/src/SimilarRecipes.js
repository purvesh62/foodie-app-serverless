import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Spinner,
  theme,
  Center,
  Text,
  Heading,
  Button,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalContent,
} from "@chakra-ui/react";
import axios from "axios";
import "./App.css";
import NavigationBar from "./Navbar";

function SimilarRecipes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [recipes, setRecipe] = useState([]);
  const [similarRecipe, setSimilarRecipe] = useState([]);
  
  useEffect(() => {
    setLoading(true);
    axios
      .post(
        "https://us-central1-serverless-assignments.cloudfunctions.net/get-recipes"
      )
      .then(function (responseData) {
        setRecipe(responseData["data"]);
        setLoading(false);
      });
  }, []);

  const handleSimilarityCheck = (recipe_id) => {
    setLoading(true);
    setSimilarRecipe([]);
    axios
      .post(
        "https://us-central1-serverless-assignments.cloudfunctions.net/similarity_getdata_api",
        { recipe_id: recipe_id, neighbours: 5 },
        { "Content-Type": "application/json" }
      )
      .then(function (responseData) {
        console.log(responseData);
        setSimilarRecipe(responseData["data"]);
        setLoading(false);
      });

    onOpen();
  };

  return (
    <>
      <NavigationBar />
      <ChakraProvider>
        <Box>
          {isLoading && (
            <Center width="100%" height="100vh">
              <Spinner
                verticalAlign=""
                thickness="4px"
                speed="0.8s"
                emptyColor="gray.200"
                color="green.500"
                size="xl"
                disabled={true}
              />
            </Center>
          )}
        </Box>
        <Box m={10}>
          {Object.entries(recipes).map(([key, value]) => (
            <Box
              p={10}
              border="1px"
              borderColor="gray.200"
              mb={5}
              borderRadius="10px"
            >
              <Badge size="md" colorScheme="green" p={2} pl={5} pr={5}>
                {value.name}
              </Badge>
              <Text mt={5} noOfLines={5} className="text-black">
                {value.recipe}
              </Text>
              <Button
                colorScheme="blue"
                mt={10}
                onClick={() => handleSimilarityCheck(value.id)}
              >
                Check Similar Recipes
              </Button>
            </Box>
          ))}
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoading && (
                <Center width="100%" height="100vh">
                  <Spinner
                    verticalAlign=""
                    thickness="4px"
                    speed="0.8s"
                    emptyColor="gray.200"
                    color="green.500"
                    size="xl"
                    disabled={true}
                  />
                </Center>
              )}
              {Object.entries(similarRecipe).map(([key, value]) => (
                <Box
                  p={10}
                  border="1px"
                  borderColor="gray.200"
                  mb={5}
                  borderRadius="10px"
                >
                  <Badge size="md" colorScheme="green" p={2} pl={5} pr={5}>
                    {value.name}
                  </Badge>
                  <Text mt={5} noOfLines={2} className="text-black">
                    {value.recipe}
                  </Text>
                  <Badge mt={3} p={3} colorScheme="blue">
                    Similarity Score : + {value.similarity.substring(0, 7)}
                  </Badge>
                </Box>
              ))}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </>
  );
}

export default SimilarRecipes;

