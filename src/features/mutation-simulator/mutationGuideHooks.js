export function createMutationGuideHooks(actions) {
  return {
    selectNonsensePreset() {
      actions.selectNonsensePreset();
    },
    translateCurrentMutation() {
      actions.translateCurrentMutation();
    },
    showNonsenseIntermediateStep() {
      actions.showNonsenseIntermediateStep();
    },
    showNonsenseFinishedStep() {
      actions.showNonsenseFinishedStep();
    },
  };
}
