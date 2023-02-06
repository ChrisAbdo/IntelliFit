'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Home = () => {
  const [loading, setLoading] = useState(false);
  //   const [bio, setBio] = useState('');
  //   const [generatedBios, setGeneratedBios] = useState<String>('');
  const [generatedWorkouts, setGeneratedWorkouts] = useState<String>('');
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [desiredWeight, setDesiredWeight] = useState<number>(0);
  const [intensity, setIntensity] = useState<string>('');
  const [daysAWeek, setDaysAWeek] = useState<number>(0);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const inputs = [
    <div key={1} className="w-full ml-6">
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="currentweight">Your Current Weight (pounds)</Label>
        <Input
          className="w-full"
          type="number"
          id="currentweight"
          placeholder="Current Weight"
          onChange={(e) => {
            setCurrentWeight(parseInt(e.target.value));
          }}
        />
      </div>
    </div>,
    <div key={2} className="w-full ml-6">
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="currentweight">Your Desired Weight (pounds)</Label>
        <Input
          type="number"
          id="desiredweight"
          placeholder="Desired Weight"
          onChange={(e) => {
            setDesiredWeight(parseInt(e.target.value));
          }}
        />
      </div>
    </div>,

    <div key={3} className="w-full ml-6">
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="currentweight">How Hard Are You Willing to Go?</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Intensity Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="feel">Feel It In The Morning</SelectItem>
            <SelectItem value="why">Why Did I Do This</SelectItem>
            <SelectItem value="military">Military Intensity</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>,

    <div key={4} className="w-full ml-6">
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="currentweight">
          How many days do you workout a week?
        </Label>
        <Input
          className="w-full"
          type="text"
          id="daysaweek"
          placeholder="Days a week worked out"
          onChange={(e) => setDaysAWeek(parseInt(e.target.value))}
        />
      </div>
    </div>,
  ];

  const prompt =
    'i am currently' +
    currentWeight +
    'pounds and i want to be' +
    desiredWeight +
    'pounds. i am willing to go' +
    intensity +
    'and i work out' +
    daysAWeek +
    'days a week. make me a workout plan.';

  const generateBio = async (e: any) => {
    e.preventDefault();
    // setGeneratedBios('');
    setGeneratedWorkouts('');
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log('Edge function returned.');

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      //   setGeneratedBios((prev) => prev + chunkValue);
      setGeneratedWorkouts((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const handleClick = (next: any) => {
    if (next) {
      setDirection('left');
    } else {
      setDirection('right');
    }
  };
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full flex-col items-center text-center px-4">
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold overflow-hidden mt-4">
          Welcome to IntelliFit, the AI powered workout planner.
        </h1>
        <p className="text-xl max-w-2xl overflow-hidden mt-4 mb-4">
          Just fill out some questions and we&apos;ll generate a workout plan
          for you.
        </p>
        <div className="max-w-xl w-full">
          <AnimatePresence>
            <div
              className="input-container"
              style={{
                display: 'inline-flex',
                width: '100%',
                overflowX: 'hidden',
              }}
            >
              {inputs[currentInputIndex] && (
                <motion.div
                  key={currentInputIndex}
                  initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: direction === 'right' ? '-100%' : '100%' }}
                  transition={{ type: 'tween', duration: 0.5 }}
                >
                  {inputs[currentInputIndex]}
                </motion.div>
              )}
            </div>
          </AnimatePresence>

          <div className="flex justify-between mt-4 px-6">
            <Button
              variant="default"
              onClick={() => {
                setCurrentInputIndex(currentInputIndex - 1);
                handleClick(false);
              }}
              disabled={currentInputIndex === 0}
            >
              Previous
            </Button>

            <h1 className="">
              {currentInputIndex + 1} of {inputs.length}
            </h1>
            <Button
              variant="default"
              onClick={() => {
                setCurrentInputIndex(currentInputIndex + 1);
                handleClick(true);
              }}
              disabled={loading || currentInputIndex === inputs.length - 1}
            >
              Next
            </Button>
          </div>
          {/* <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com.'
            }
          /> */}

          {!loading && (
            <Button className="w-full mt-12" onClick={(e) => generateBio(e)}>
              <Dumbbell className="mr-2 h-4 w-4" />
              Generate your bio&nbsp;&nbsp;
              <Dumbbell className="mr-2 h-4 w-4" />
            </Button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            ></button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <AnimatePresence mode="wait">
          <motion.div className="space-y-10 my-10">
            {generatedWorkouts && (
              <>
                <div>
                  <h2 className="sm:text-4xl text-3xl font-bold mx-auto">
                    Your Workout Plan
                  </h2>
                </div>
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  {generatedWorkouts.split('2.').map((generatedWorkout) => {
                    return (
                      <div
                        className="bg-white dark:bg-[#303030] text-black dark:text-white rounded-xl shadow-md p-4 hover:bg-gray-100 dark:hover:bg-[#303030]/80 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedWorkout);
                          toast('Bio copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedWorkout}
                      >
                        <p>{generatedWorkout}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
