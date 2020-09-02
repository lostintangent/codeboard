import { graphql } from "@octokit/graphql/dist-types/types";
import { store } from ".";

export async function addProjectColumn(
  octoKit: graphql,
  projectId: string,
  columnName: string
) {
  const {
    addProjectColumn: {
      columnEdge: { node },
    },
  } = await octoKit(
    `mutation addProjectColumn($projectId: ID!, $columnName: String!) {
    addProjectColumn(input: { projectId: $projectId, name: $columnName}) {
      columnEdge {
        node {
          id
          name
        }
      }
    }
  }`,
    {
      projectId,
      columnName,
    }
  );

  const column = {
    ...node,
    title: node.name,
    cards: [],
  };

  store.board?.lanes.push(column);
}

export async function deleteProjectColumn(octoKit: graphql, columnId: string) {
  await octoKit(
    `mutation deleteProjectColumn($columnId: ID!) {
      deleteProjectColumn(input: {columnId: $columnId}) {
        clientMutationId
      }
    }
    `,
    {
      columnId,
    }
  );

  store.board!.lanes = store.board!.lanes.filter(
    (lane) => lane.id !== columnId
  );
}

/**
In-progress | Todo | Oops
=> afterColumnId
   newPosition = 2
   lanes [ 2 - 1] = lanes [1 ] = Todo


Todo | Oops | In-progress
*/

export async function moveProjectColumn(
  octoKit: graphql,
  columnId: string,
  newPosition: number
) {
  const column = store.board!.lanes.find((lane) => lane.id === columnId)!;
  store.board!.lanes = store.board!.lanes.filter(
    (lane) => lane.id !== columnId
  );
  store.board!.lanes.splice(newPosition, 0, column);

  const afterColumnId =
    newPosition === 0 ? null : store.board!.lanes[newPosition - 1].id;

  await octoKit(
    `mutation moveProjectColumn($columnId: ID!, $afterColumnId: ID) {
      moveProjectColumn(input: {columnId: $columnId, afterColumnId: $afterColumnId}) {
        clientMutationId
      }
    }
    `,
    {
      columnId,
      afterColumnId,
    }
  );
}

export async function updateProjectColumn(
  octoKit: graphql,
  columnId: string,
  name: string
) {
  await octoKit(
    `mutation updateProjectColumn($columnId: ID!, $name: String!) {
      updateProjectColumn(input: {projectColumnId: $columnId, name: $name}) {
        projectColumn {
          name
          id
        }
      }
    }
    
    `,
    {
      columnId,
      name,
    }
  );

  store.board!.lanes.find((lane) => lane.id === columnId)!.title = name;
}
