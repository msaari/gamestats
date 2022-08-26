import {
	createStateHook,
	createActionsHook,
	createEffectsHook,
	createReactionHook
  } from 'overmind-react'
import state from "./state"
import * as actions from "./actions"
import * as effects from "./effects"
import onInitialize from "./onInitialize"

export const config = {
	onInitialize,
	state,
	actions,
	effects
}

export const useAppState = createStateHook()
export const useActions = createActionsHook()
export const useEffects = createEffectsHook()
export const useReaction = createReactionHook()