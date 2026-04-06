from typing import TypedDict, List
from langgraph.graph import StateGraph, END
import time

class AgentState(TypedDict):
    messages: List[str]
    current_node: str
    thought_process: List[str]

def researcher_node(state: AgentState):
    thought = "Researching the request: Searching through specialized knowledge bases..."
    state["thought_process"].append(thought)
    state["current_node"] = "researcher"
    return state

def analyst_node(state: AgentState):
    thought = "Analyzing findings: Identifying key patterns and architectural requirements..."
    state["thought_process"].append(thought)
    state["current_node"] = "analyst"
    return state

def generator_node(state: AgentState):
    thought = "Generating response: Synthesizing the solution with a high-end tech focus..."
    state["thought_process"].append(thought)
    state["current_node"] = "generator"
    return state

def create_magic_graph():
    # Initialize the graph
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("analyst", analyst_node)
    workflow.add_node("generator", generator_node)

    # Add edges
    workflow.set_entry_point("researcher")
    workflow.add_edge("researcher", "analyst")
    workflow.add_edge("analyst", "generator")
    workflow.add_edge("generator", END)

    # Compile the graph
    return workflow.compile()

# Example usage function
async def run_magic_agent(initial_message: str):
    graph = create_magic_graph()
    state = {"messages": [initial_message], "current_node": "start", "thought_process": []}
    
    # In a real app, this would be an async stream
    async for event in graph.astream(state):
        # Access state nodes for UI visibility
        pass
