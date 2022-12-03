import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Textarea,
  theme,
  Center,
  Select,
  Button,
  useToast,
  HStack,
  Badge,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import NavigationBar from "./Navbar";

function DataProcessing() {
  const toast = useToast();
  const [resturantId, setResturantId] = useState("");
  const [recipe, setRecipe] = useState("");
  const [dataId, setDataId] = useState("");
  const [extractedData, setExtractedData] = useState({ data: [] });
  const [extractionFlag, setExtractionFlag] = useState(false);

  const handleFileUpload = async () => {
    if (resturantId !== "") {
      const body = { data: recipe, resturantId: resturantId };

      await axios
        .post(
          "https://zul3fxk2zj3jf3wp4lhtk3enhq0jmmyx.lambda-url.us-east-1.on.aws/",
          body
        )
        .then((response) => setDataId(response));

      toast({
        title: "Recepie Uploaded for - " + resturantId,
        description: "Recepie Uploaded!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error Occured!",
        description: "Error in Uploading File",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTagUpload = () => {
    axios
      .post(
        "https://yipv6hvsqv5u4yumu3wb4ivelq0ekevv.lambda-url.us-east-1.on.aws/",
        {
          recipe_id: dataId["data"]["data-id"],
          ingredients: extractedData["data"],
        }
      )
      .then(function (response) {
        console.log(response);
      });
  };

  const handleExtraction = async () => {
    if (resturantId !== "") {
      const body = {
        fileId: dataId["data"]["data-id"],
        resturantId: resturantId,
      };

      await axios
        .post(
          "https://2n24zoxmiulklkq6giinvdquca0hsfyu.lambda-url.us-east-1.on.aws/",
          body
        )
        .then((response) => setExtractedData(response));

      setExtractionFlag(true);
    } else {
      toast({
        title: "Error Occured!",
        description: "Error in Extracting Ingredients",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavigationBar />
      <ChakraProvider theme={theme}>
        <Center>
          <Box w={750} p={10}>
            <Heading as="h2" size="xl" noOfLines={1} mb={5}>
              Recepie
            </Heading>
            <Select
              variant="filled"
              placeholder="Select Resturant"
              mb={5}
              onChange={(event) => setResturantId(event.target.value)}
            >
              <option value="Resturant1">Resturant1</option>
              <option value="Resturant2">Resturant2</option>
              <option value="Resturant3">Resturant3</option>
            </Select>
            <Textarea
              placeholder="Here is a sample placeholder"
              h={200}
              mb={5}
              onChange={(e) => setRecipe(e.target.value)}
            />
            <HStack spacing="10px" mb={10}>
              <Button colorScheme="purple" size="md" onClick={handleFileUpload}>
                Upload
              </Button>
              <Button colorScheme="green" size="md" onClick={handleExtraction}>
                Extract
              </Button>
            </HStack>
            <VStack>
              <Box>
                {extractedData["data"].map((tag, i) => (
                  <Badge colorScheme="green" mr={2} p={1} pl={3} pr={3} mb={2}>
                    {tag}
                  </Badge>
                ))}
              </Box>

              {extractionFlag && (
                <Button colorScheme="green" size="md" onClick={handleTagUpload}>
                  Upload Tags
                </Button>
              )}
            </VStack>
          </Box>
        </Center>
      </ChakraProvider>
    </>
  );
}

export default DataProcessing;
