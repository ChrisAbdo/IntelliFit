'use client';

import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';

import React, { useState } from 'react';
import { Dumbbell, Loader2 } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.5 },
  },
};

const H1 = ({ children, delay }: any) => {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start('visible');
  });

  return (
    <motion.h1
      className="text-xs px-2 py-1 font-bold bg-gray-100 text-gray-600 rounded"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      transition={{ delay: delay }}
    >
      {children}
    </motion.h1>
  );
};

const numbers = ['1.', '2.', '3.', '4.', '5.', '6.', '7.'];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [completed, setCompleted] = useState(false);
  //   const [bio, setBio] = useState('');
  //   const [generatedBios, setGeneratedBios] = useState<String>('');
  const [generatedWorkouts, setGeneratedWorkouts] = useState<String>('');
  const [currentWeight, setCurrentWeight] = useState<number>();
  const [desiredWeight, setDesiredWeight] = useState<number>();
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
          value={currentWeight}
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
          value={desiredWeight}
          onChange={(e) => {
            setDesiredWeight(parseInt(e.target.value));
          }}
        />
      </div>
    </div>,

    <div key={3} className="w-full ml-6">
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="currentweight">How Hard Are You Willing to Go?</Label>
        <Select
          onValueChange={(value) => setIntensity(value)}
          value={intensity}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
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
        <Label htmlFor="currentweight">Days a week you workout?</Label>
        <Input
          className="w-full"
          type="number"
          max={7}
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
    'days a week. make me a workout plan. clearly labeled "1.", "2.", "3.", etc, respective to the days';

  const generateBio = async (e: any) => {
    e.preventDefault();
    // setGeneratedBios('');
    setGeneratedWorkouts('');
    setLoading(true);
    setLoadingState(true);
    setCompleted(false);
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
    setLoadingState(false);
    setCompleted(true);
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Before You Start</AccordionTrigger>
            <AccordionContent>
              Make sure that this workout plan works with you. It may be too
              intense or not intense enough. Doing a workout plan that&apos;s
              too intense is dangerous and can lead to injury. If you&apos;re
              not sure, ask a doctor or a trainer.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Future Plans for IntelliFit</AccordionTrigger>
            <AccordionContent>
              Some features: <br />
              - AI Generated Workout Names <br />
              - More accurate workout plans <br />
              - More questions <br />
              - More customization <br />
              - More features TBA <br />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="max-w-xl w-full bg-[#DADDE2] dark:bg-[#1f1f1f] rounded-md p-6 mt-6 ">
          {loadingState ? (
            <div>
              <h1 className="float-left opacity-0">
                {currentInputIndex + 1} of {inputs.length}
              </h1>
              <AnimatePresence>
                <div
                  className="input-container opacity-0"
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
                      className="lg:w-[91%] w-[85%]"
                    >
                      {inputs[currentInputIndex]}
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>

              <div className="flex justify-between mt-4 px-6 opacity-0">
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

              {loading && (
                <motion.div className="" animate={{ y: -100 }}>
                  <Button className="w-full mt-12" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </Button>
                </motion.div>
              )}
            </div>
          ) : completed ? (
            <AnimatePresence mode="wait">
              <motion.div className="space-y-10 my-10">
                {Array.from({ length: daysAWeek }, (_, i) => i + 1).map(
                  (num) => {
                    const startIndex = generatedWorkouts.indexOf(num + '.');
                    const nextNum =
                      num === 7
                        ? null
                        : generatedWorkouts.indexOf(num + 1 + '.');
                    const endIndex =
                      nextNum === -1 ? generatedWorkouts.length : nextNum;
                    const workout = generatedWorkouts.substring(
                      startIndex,
                      endIndex
                    );
                    return (
                      <div
                        className="bg-white dark:bg-[#303030] text-black dark:text-white rounded-xl shadow-md p-4 hover:bg-gray-100 dark:hover:bg-[#303030]/80 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(workout);
                          toast.success('Bio copied to clipboard');
                        }}
                        key={workout}
                      >
                        <p>{workout}</p>
                      </div>
                    );
                  }
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div>
              <h1 className="float-left">
                {currentInputIndex + 1} of {inputs.length}
              </h1>
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
                      className="lg:w-[91%] w-[85%]"
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

              {!loading && (
                <Button
                  className="w-full mt-12"
                  onClick={(e) => generateBio(e)}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Generate your workout&nbsp;&nbsp;
                  <Dumbbell className="mr-2 h-4 w-4" />
                </Button>
              )}
              {loading && (
                <Button className="w-full mt-12" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </Button>
              )}
            </div>
          )}
        </div>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
      </main>
    </div>
  );
};

export default Home;
