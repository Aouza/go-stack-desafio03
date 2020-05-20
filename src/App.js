import React, { useState, useEffect } from 'react';
import api from "./services/api"

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
      api.get("/repositories").then(response => {
          
          setRepositories(response.data)

      });

  }, [])

  async function addRepository(){
    const response = await api.post("/repositories", {
        title: "Novo curso do Caio Gabriel",
        techs:[
            "Javascript",
            "NodeJs",
            "ReactJS"
        ]
    })

    const repository = response.data;

    setRepositories([...repositories, repository])

}

async function deleteButton(id){
  await api.delete(`/repositories/${id}`);

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  repositories.splice(repositoryIndex, 1);

  setRepositories([...repositories])
  
}


  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const { like } = response.data;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    repositories[repositoryIndex].like = like;

    setRepositories([...repositories]);


  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>

        <FlatList
        
        data={repositories}
        keyExtractor={(repository, index) => String(index)}
        renderItem={({item: repository}) => (
          <>
            <Text style={styles.repository}>{repository.title}</Text>
            <FlatList
              style={styles.techsContainer}
              data={repository.techs}
              keyExtractor = {(repository, index) => index.toString()}
              renderItem={({item: tech}) => (
                <Text style={styles.tech}>{tech}</Text>
              )}

            />
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} curtida{repository.like > 1 ? 's' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${repository.id}`}
              >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </>
        )}
        
        />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
