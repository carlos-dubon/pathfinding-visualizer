# Pathfinding Visualizer

<p align="center">
<img src="src/assets/logo.svg" alt="Logo" width="100" height="100">
</p>
<p align="center">Technology stack used:</p>

<p align="center">
<img src="https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white" alt="Angular">
<img src="https://img.shields.io/badge/Angular Material-F7A225?style=flat&logo=angular&logoColor=white" alt="Angular Material">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white" alt="Sass">
<img src="https://img.shields.io/badge/GitHub Pages-100000?style=flat&logo=github&logoColor=white" alt="GitHub Pages">
</p>

<p align="center">
<a href="https://carlos-dubon.github.io/pathfinding-visualizer/" target="_blank">https://carlos-dubon.github.io/pathfinding-visualizer/</a>
</center>
</p>

A visualization tool for **Dijkstra’s pathfinding algorithm** and **Prim’s maze generation algorithm**. Find the shortest path from a source to a destination. This project is based on graph theory.

## Dijkstra's algorithm 
Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.

It was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years later.

## Prim's algorithm
Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.

The algorithm was developed in 1930 by Czech mathematician Vojtěch Jarník and later rediscovered and republished by computer scientists Robert C. Prim in 1957 and Edsger W. Dijkstra in 1959.

## Difference between Dijkstra's algorithm and Prim's algorithm

Dijkstra’s algorithm finds the shortest path, but Prim’s algorithm finds the Minimum Spanning Tree (MST).

In practice, Dijkstra’s algorithm is used when we want to save time and fuel traveling from one point to another. Prim’s algorithm, on the other hand, is used when we want to minimize material costs in constructing roads that connect multiple points to each other.

## Features

- ### Drag and drop nodes
    Drag and drop the nodes across the grid.

    ![Drag and drop nodes](readme_gifs/1.gif)

- ### Toggle walls
    Click on the grid to add a wall. Walls are impenetrable, meaning that a path cannot cross through them.

    ![Toggle walls](readme_gifs/2.gif)

- ### Generate random mazes
    Generate random mazes with Prim's algorithm. You are guaranteed to get a path from the source to the target with every maze generated.

    ![Generate maze](readme_gifs/3.gif)

- ### Visualize Dijkstra's pathfinding algorithm
    See Dijkstra's pathfinding algorithm in action, and visualize how it gets to find the shortest path between nodes in a graph.

    ![Dijkstra's pathfinding algorithm](readme_gifs/4.gif)

- ### Visualize different outcomes
    Move the nodes once the algorithm is done, add or remove walls from the grid. This will allow you to see different paths.

    ![Visualize different outcomes](readme_gifs/5.gif)

- ### Get creative!
  
    ![Get creative](readme_gifs/6.gif)

- ### Change the speed of the algorithm
  
    ![Speed](readme_gifs/7.gif)

- ### Mobile friendly
  
    ![Mobile friendly](readme_gifs/8.gif)

I hope you have just as much fun playing around with this visualization tool as I had building it!