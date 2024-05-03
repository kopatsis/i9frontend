// @ts-nocheck
// @ts-ignore

import { currenttime, strRoundsStSet, genTimesStSet, scriptStSet, timescriptStSet, storedWorkoutSet, workoutTypeSet, workoutRoundsStSet, idSet } from "$lib/stores/workout";

export function unravelstretchWO(response) {

	let runningtime = 0.0;

	const workout = response.positions?.workout;
	if (workout == null) {
		throw new Error('No existing workout');
	}

	const dynamicSlice = workout.DynamicSlice;
	const staticSlice = workout.StaticSlice;
	if (dynamicSlice == null || staticSlice == null) {
		throw new Error('No existing static or dynamic slice');
	}

	if (workout.StaticSamples == null || workout.DynamicSamples == null) {
		throw new Error('No existing static or dynamic samples');
	}
	const strRounds = { static: { samples: workout.StaticSamples, titles: workout.StaticNames, times: [] }, dynamic: { samples: workout.DynamicSamples, titles: workout.DynamicNames, times: [] } };
	const genTimes = { dynamic: 0, static: 0, end: 0 };
	const script = [];
	const timescript = [];

	for (let i = 0; i < dynamicSlice.length; i++) {
		const set = dynamicSlice[i];

		timescript.push({ time: runningtime, isrest: false });
		strRounds.dynamic.times.push(set.FullTime);

		for (let j = 0; j < set.RepCount; j++) {
			const rep = set.RepSlice[set.RepSequence[j]];

			for (let k = 0; k < rep.Positions.length; k++) {
				script.push({
					time: runningtime,
					position: rep.Positions[k],
					set: i + 1,
					names: [workout.DynamicNames[i]],
					reps: [0]
				});

				if (set.SeparateStretch && set.RepSlice.length > 1) {
					if (set.RepSequence[j] === 0) {
						script[script.length - 1].names[0] += ' - Left';
					} else {
						script[script.length - 1].names[0] += ' - Right';
					}
				}

				runningtime += rep.Times[k];
			}
		}
	}

	genTimes.static = runningtime;

	for (let i = 0; i < staticSlice.length; i++) {
		const set = staticSlice[i];

		timescript.push({ time: runningtime, isrest: false });
		strRounds.static.times.push(set.FullTime);

		for (let j = 0; j < set.RepCount; j++) {
			const rep = set.RepSlice[set.RepSequence[j]];

			for (let k = 0; k < rep.Positions.length; k++) {
				script.push({
					time: runningtime,
					position: rep.Positions[k],
					set: i + 1,
					names: [workout.StaticNames[i]],
					reps: [0]
				});

				if (set.RepSlice.length > 1) {
					if (set.RepSequence[j] === 0) {
						script[script.length - 1].names[0] += ' - Left';
					} else {
						script[script.length - 1].names[0] += ' - Right';
					}
				}

				runningtime += rep.Times[k];
			}
		}
	}

	genTimes.end = runningtime;

	if (response.PausedTime !== 0){
		currenttime.set(response.PausedTime);
	}

	strRoundsStSet(strRounds);
	genTimesStSet(genTimes);
	scriptStSet(script);
	timescriptStSet(timescript);
	storedWorkoutSet(response);
	workoutTypeSet("Stretch");
	idSet(response.workout.ID)
	
}

// @ts-ignore
export function unravelWO(response, type="Regular") {
	let runningtime = 0.0;

	const workout = response.positions?.workout;
	if (workout == null) {
		throw new Error('No existing workout');
	}

	const dynamicSlice = workout.DynamicSlice;
	const staticSlice = workout.StaticSlice;
	const exerRounds = workout.Exercises;
	if (dynamicSlice == null || staticSlice == null || exerRounds == null) {
		throw new Error('No existing static or dynamic slice');
	}

	if (workout.StaticSamples == null || workout.DynamicSamples == null) {
		throw new Error('No existing static or dynamic samples');
	}
	const strRounds = { static: { samples: workout.StaticSamples, titles: workout.StaticNames, times: [] }, dynamic: { samples: workout.DynamicSamples, titles: workout.DynamicNames, times: [] }, rest: 0 };
	const genTimes = { dynamic: 0, exercises: 0, static: 0, end: 0 };
	const workoutRounds = [];
	const script = [];
	const timescript = [];

	for (let i = 0; i < dynamicSlice.length; i++) {
		const set = dynamicSlice[i];

		timescript.push({ time: runningtime, isrest: false });
		strRounds.dynamic.times.push(set.FullTime);

		for (let j = 0; j < set.RepCount; j++) {
			const rep = set.RepSlice[set.RepSequence[j]];

			for (let k = 0; k < rep.Positions.length; k++) {
				script.push({
					time: runningtime,
					position: rep.Positions[k],
					set: i + 1,
					names: [workout.DynamicNames[i]],
					reps: [0]
				});

				if (set.SeparateStretch && set.RepSlice.length > 1) {
					if (set.RepSequence[j] === 0) {
						script[script.length - 1].names[0] += ' - Left';
					} else {
						script[script.length - 1].names[0] += ' - Right';
					}
				}

				runningtime += rep.Times[k];
			}
		}
	}

	timescript.push({ time: runningtime, isrest: true });
	script.push({
		time: runningtime,
		position: workout.StandingPosition,
		set: 1,
		names: ['Round Rest'],
		reps: [0]
	});
	runningtime += workout.DynamicRest;
	genTimes.exercises = runningtime;
	strRounds.rest = workout.DynamicRest;

	for (let h = 0; h < exerRounds.length; h++) {
		const round = exerRounds[h];

		workoutRounds.push({
			round: h + 1,
			sets: round.SetCount,
			type: round.Type,
			samples: round.SampleIDs,
			titles: round.Names,
			reps: round.Reps,
			on: round.ExerPerSet, 
			off: round.RestPerSet,
			roundrest: round.RestPerRound,
			start: runningtime
		});

		if (round.Type == "Split") {
			let lastEntry = workoutRounds[workoutRounds.length - 1];
			lastEntry.titles[0] += " (" + (round.SplitPairs[0] ? "2" : "1") + ")";
			lastEntry.titles[lastEntry.titles.length - 1] += " (" + (round.SplitPairs[round.SplitPairs.length - 1] ? "2" : "1") + ")";
			workoutRounds[workoutRounds.length - 1] = lastEntry;
		}

		for (let i = 0; i < round.SetCount; i++) {
			const set = round.SetSlice[round.SetSequence[i]];

			timescript.push({ time: runningtime, isrest: false });

			let startTime = runningtime

			for (let j = 0; j < set.RepCount; j++) {
				const rep = set.RepSlice[set.RepSequence[j]];

				for (let k = 0; k < rep.Positions.length; k++) {
					script.push({
						time: runningtime,
						position: rep.Positions[k],
						set: i + 1,
						names: [round.Names],
					});

					if (round.Type == "Combo") {
						script[script.length - 1].reps = round.Reps;
					} else {
						script[script.length - 1].reps = [set.RepCount];
					}

					if (round.Type == "Split") {
						let lastEntry = script[script.length - 1]
						lastEntry.names[0] += " (" + (round.SplitPairs[0] ? "2" : "1") + ")"
						lastEntry.names[lastEntry.names.length - 1] += " (" + (round.SplitPairs[round.SplitPairs.length - 1] ? "2" : "1") + ")"
						script[script.length - 1] = lastEntry
					}

					runningtime += rep.Times[k];
				}
			}
			script.push({
				time: runningtime,
				position: workout.StandingPosition,
				set: i + 1,
				names: round.Names,
			});

			runningtime = round.ExerPerSet + startTime
			timescript.push({ time: runningtime, isrest: true });

			if (i === round.SetCount - 1) {
				script.push({
					time: runningtime,
					position: workout.CongratsPosition,
					set: i + 1,
					names: ["Congrats"],
				});
				runningtime += 1
				script.push({
					time: runningtime,
					position: set.RestPosition,
					set: i + 1,
					names: ["Round Rest"],
				});
				runningtime += round.RestPerRound - 1
			} else {
				script.push({
					time: runningtime,
					position: workout.StandingPosition,
					set: i + 1,
					names: ["Set Rest"],
				});
			}
			runningtime += round.RestPerSet

		}
	}

	genTimes.static = runningtime

	for (let i = 0; i < staticSlice.length; i++) {
		const set = staticSlice[i];

		timescript.push({ time: runningtime, isrest: false });
		strRounds.static.times.push(set.FullTime);

		for (let j = 0; j < set.RepCount; j++) {
			const rep = set.RepSlice[set.RepSequence[j]];

			for (let k = 0; k < rep.Positions.length; k++) {
				script.push({
					time: runningtime,
					position: rep.Positions[k],
					set: i + 1,
					names: [workout.StaticNames[i]],
					reps: [0]
				});

				if (set.RepSlice.length > 1) {
					if (set.RepSequence[j] === 0) {
						script[script.length - 1].names[0] += ' - Left';
					} else {
						script[script.length - 1].names[0] += ' - Right';
					}
				}

				runningtime += rep.Times[k];
			}
		}
	}

	genTimes.end = runningtime;

	if (response.PausedTime !== 0){
		currenttime.set(response.PausedTime);
	}

	strRoundsStSet(strRounds);
	genTimesStSet(genTimes);
	scriptStSet(script);
	timescriptStSet(timescript);
	workoutRoundsStSet(workoutRounds);
	storedWorkoutSet(response);
	workoutTypeSet(type);
	idSet(response.workout.ID)
}
