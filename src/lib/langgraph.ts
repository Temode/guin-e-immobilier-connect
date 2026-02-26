/**
 * LangGraph Lightweight — Moteur de workflow par graphe
 * Implémentation browser-compatible inspirée de @langchain/langgraph
 *
 * Concepts :
 *  - StateGraph : graphe orienté dont chaque nœud transforme un état
 *  - Node : fonction async (state) → Partial<State>
 *  - Edge : lien direct entre deux nœuds
 *  - ConditionalEdge : routage dynamique basé sur l'état
 *  - START / END : nœuds spéciaux de début et fin
 */

export const START = '__start__';
export const END = '__end__';

type NodeFn<S> = (state: S) => Promise<Partial<S>>;
type ConditionFn<S> = (state: S) => string | Promise<string>;

interface CompiledGraph<S> {
  invoke: (initialState: S) => Promise<S>;
  stream: (initialState: S, onStep: (nodeName: string, state: S) => void) => Promise<S>;
}

export class StateGraph<S extends Record<string, unknown>> {
  private nodes = new Map<string, NodeFn<S>>();
  private edges = new Map<string, string>();
  private conditionalEdges = new Map<string, { condition: ConditionFn<S>; mapping: Record<string, string> }>();
  private entryPoint: string | null = null;

  /** Ajouter un nœud de traitement */
  addNode(name: string, fn: NodeFn<S>): this {
    if (name === START || name === END) throw new Error(`Cannot use reserved name "${name}"`);
    this.nodes.set(name, fn);
    return this;
  }

  /** Ajouter une arête directe entre deux nœuds */
  addEdge(from: string, to: string): this {
    this.edges.set(from, to);
    if (from === START) this.entryPoint = to;
    return this;
  }

  /** Ajouter une arête conditionnelle (routage dynamique) */
  addConditionalEdge(from: string, condition: ConditionFn<S>, mapping: Record<string, string>): this {
    this.conditionalEdges.set(from, { condition, mapping });
    return this;
  }

  /** Compiler le graphe en un exécuteur */
  compile(): CompiledGraph<S> {
    const graph = this;

    return {
      /** Exécuter le graphe et retourner l'état final */
      async invoke(initialState: S): Promise<S> {
        return graph._run(initialState);
      },

      /** Exécuter le graphe avec callback à chaque étape */
      async stream(initialState: S, onStep: (nodeName: string, state: S) => void): Promise<S> {
        return graph._run(initialState, onStep);
      },
    };
  }

  /** Exécution interne du graphe */
  private async _run(state: S, onStep?: (name: string, state: S) => void): Promise<S> {
    let currentNode = this.entryPoint;
    if (!currentNode) throw new Error('No entry point defined. Use addEdge(START, "firstNode").');

    const maxSteps = 50; // Protection contre les boucles infinies
    let steps = 0;

    while (currentNode && currentNode !== END && steps < maxSteps) {
      steps++;

      const nodeFn = this.nodes.get(currentNode);
      if (!nodeFn) throw new Error(`Node "${currentNode}" not found in graph.`);

      // Exécuter le nœud
      const patch = await nodeFn(state);
      state = { ...state, ...patch };

      // Callback pour le streaming
      if (onStep) onStep(currentNode, { ...state });

      // Déterminer le prochain nœud
      if (this.conditionalEdges.has(currentNode)) {
        const { condition, mapping } = this.conditionalEdges.get(currentNode)!;
        const result = await condition(state);
        currentNode = mapping[result] || END;
      } else if (this.edges.has(currentNode)) {
        currentNode = this.edges.get(currentNode)!;
      } else {
        // Pas d'arête définie → fin
        currentNode = END;
      }
    }

    if (steps >= maxSteps) {
      console.warn('[LangGraph] Max steps reached — possible infinite loop.');
    }

    return state;
  }
}
