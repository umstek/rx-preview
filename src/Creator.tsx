import { Fragment, useState } from "react";
import {
  Canvas,
  Edge,
  Label,
  MarkerArrow,
  Node,
  Port,
  NodeData,
  PortData,
  EdgeData,
  hasLink,
  detectCircular,
  useUndo,
  UndoRedoEvent,
} from "reaflow";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@heroicons/react/solid";

import type { NodeDescriptor } from "./NodeDescriptor";
import { range } from "./util";
import { Button, MenuItem } from "./components";

export function XMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="transition-colors inline-flex w-full justify-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-opacity-75 active:bg-indigo-600 active:text-indigo-50">
            <PlusIcon className="h-4 w-4 mr-2" aria-label="Insert" />
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 py-2 w-56 origin-top-right rounded-md shadow-sm bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            {children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const n = (name: string, outputs = 0, primaryInputs = 0, secondaryInputs = 0) => ({
  name,
  outputs,
  primaryInputs,
  secondaryInputs,
});

const NODES: NodeDescriptor[] = [
  n("EMPTY", 1),
  n("NEVER", 1),
  n("throwError", 1),
  n("of", 1),
  n("from", 1),
  n("map", 1, 1),
  n("filter", 1, 1),
  n("combineLatestWith", 1, 1, 1),
];

export function CreatorMenu() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const { undo, redo, canUndo, canRedo, history, clear, count } = useUndo({
    nodes,
    edges,
    onUndoRedo: (state: UndoRedoEvent) => {
      console.log("Undo / Redo", state);
      if (state.type !== "clear" && state.edges && state.nodes) {
        setEdges(state.edges);
        setNodes(state.nodes);
      }
    },
  });
  const navigate = useNavigate();

  console.log("CreatorMenu", { nodes, edges });

  return (
    <div>
      <div className="flex flex-row justify-center">
        <div className="text-right">
          <Button onClick={undo} disabled={!canUndo}>
            <ArrowLeftIcon className="h-4 w-4" aria-label="Undo" />
          </Button>
        </div>
        <div className="text-right">
          <Button onClick={redo} disabled={!canRedo}>
            <ArrowRightIcon className="h-4 w-4" aria-label="Redo" />
          </Button>
        </div>

        <XMenu>
          {NODES.map((node) => (
            <MenuItem
              label={node.name}
              key={node.name}
              onClick={() => {
                const id = nanoid();
                const nodeId = `${node.name}--${id}`;

                setNodes([
                  ...nodes,
                  {
                    id: nodeId,
                    text: node.name,
                    ports: [
                      ...range(0, node.primaryInputs).map(
                        (i) =>
                          ({
                            id: `${nodeId}.p${i}`,
                            side: "NORTH",
                            height: 10,
                            width: 10,
                            className: "stroke-white stroke-1 fill-green-500",
                          } as PortData),
                      ),
                      ...range(0, node.secondaryInputs).map(
                        (i) =>
                          ({
                            id: `${nodeId}.s${i}`,
                            side: "WEST",
                            height: 10,
                            width: 10,
                            className: "stroke-white stroke-1 fill-blue-500",
                          } as PortData),
                      ),
                      ...range(0, node.outputs).map(
                        (i) =>
                          ({
                            id: `${nodeId}.o${i}`,
                            side: "SOUTH",
                            height: 10,
                            width: 10,
                            className: "stroke-white stroke-1 fill-red-500",
                          } as PortData),
                      ),
                    ],
                  },
                ]);
              }}
            />
          ))}
        </XMenu>
      </div>

      <Canvas
        maxWidth={screen.availWidth - 100}
        maxHeight={screen.availHeight - 100}
        nodes={nodes}
        edges={edges}
        node={
          <Node
            onClick={(event, node) => {
              navigate(node.id, { state: { node }, replace: true });
              console.log("Node clicked", node);
            }}
            className="fill-white stroke-indigo-600 stroke-1 hover:stroke-black"
            label={<Label className="fill-indigo-600" />}
            port={<Port rx={10} ry={10} />}
          />
        }
        arrow={<MarkerArrow style={{ fill: "#b1b1b7" }} />}
        edge={<Edge />}
        onNodeLinkCheck={(_event, from: NodeData, to: NodeData, port?: PortData) => {
          if (from.id === to.id || hasLink(edges, from, to) || detectCircular(nodes, edges, from, to)) {
            return false;
          }
          return true;
        }}
        onNodeLink={(event, from: NodeData, to: NodeData, port?: PortData) => {
          const id = `${from.id}->${to.id}`;
          const edge = {
            id,
            from: from.id,
            to: to.id,
            fromPort: port?.id || from.ports?.find((p) => p.side === "SOUTH")?.id,
            toPort: to.ports?.find((p) => p.side === "NORTH")?.id,
          };
          console.log("Edge created", edge);
          setEdges([...edges, edge]);
        }}
      />
    </div>
  );
}
