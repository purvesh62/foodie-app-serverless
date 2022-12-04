import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Select,
  Grid,
  theme,
  Button,
  useDisclosure,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  ModalFooter,
  AspectRatio,
} from "@chakra-ui/react";
import axios from "axios";
import NavigationBar from "./Navbar";

function Polarity() {
  const kommuniccate = ((d, m) => {
    var kommunicateSettings =
      { "appId": "365423f5538062fede68e6d8d5cd92f1f", "popupWidget": true, "automaticChatOpenOnNavigation": true };
    var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
    s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
    var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
    window.kommunicate = m; m._globals = kommunicateSettings;
  })(document, window.kommunicate || {});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [option, setOption] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleReport = async () => {
    setLoading(true);
    onOpen();
    const response = await axios.post(
      "https://us-central1-serverless-assignments.cloudfunctions.net/Polarity_Check",
      { resturant_id: option },
      { "Content-Type": "application/json" }
    );
    await delay(5000);
    setLoading(false);
  };

  return (
    <>
      <NavigationBar />
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl" p={5}>
          <Select
            placeholder="Select option"
            mb={10}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="RES001">Resturant-1</option>
            <option value="RES002">Resturant-2</option>
            <option value="RES003">Resturant-3</option>
          </Select>
          <Button colorScheme="blue" onClick={handleReport}>
            Get Report
          </Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>Report</ModalHeader>
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
              {!isLoading && (
                <AspectRatio maxW="700px" ratio={1}>
                  <iframe
                    title="report"
                    src="https://datastudio.google.com/embed/reporting/1b2de11c-b8e1-4253-92e1-0027aea6dba4/page/Pz08C"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </AspectRatio>
              )}
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

export default Polarity;
