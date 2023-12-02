import React, {useState, useEffect} from 'react';
import {Text} from 'ink';
import spinners from 'cli-spinners';
import type {SpinnerName} from 'cli-spinners';

type Props = {
	type?: SpinnerName;
  loading?: Boolean;
};

function Spinner({type = 'dots', loading = false}: Props) {
	const [frame, setFrame] = useState(0);
	const spinner = spinners[type];

	useEffect(() => {
		if (loading) {
			const timer = setInterval(() => {
				setFrame(previousFrame => {
					const isLastFrame = previousFrame === spinner.frames.length - 1;
					return isLastFrame ? 0 : previousFrame + 1;
				});
			}, spinner.interval);
	
			return () => {
				clearInterval(timer);
			};
		}
		return () => {}
	}, [spinner, loading]);

	return loading ? <Text>{spinner.frames[frame]}</Text> : <Text>{spinner.frames[0]}</Text>;
}

export default Spinner;