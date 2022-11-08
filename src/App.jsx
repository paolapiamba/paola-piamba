import { useState, useEffect } from 'react'
import axios from 'axios'
import stringToColor from 'string-to-color'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import './App.css'

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [title, setTitle] = useState('')
  const [data, setData] = useState(null)

  const getData = async () => {
    try {
      const response = await axios.get('https://dev-chile-boolean-bff.onrender.com/answers')
      const answersList = response.data
      const targetAnswer = answersList[0].answers[6]
      const answersCount = {}

      setTitle(targetAnswer.question)
      
      for (const answer of answersList) {
        const answerIndex = 6
        const userAnswer = answer.answers[answerIndex]

        for (const job of userAnswer.answer){
          if (answersCount[job]) {
            answersCount[job] = answersCount[job] + 1
          } else {
            answersCount[job] = 1
          }
        }
      }

      const labels = Object.keys(answersCount)
      const data = Object.values(answersCount)
      const backgroundColor = labels.map((label) => stringToColor(label))
      
      return { labels, data, backgroundColor }
    } catch (error) {
      console.log(error.message)
    }
  }
  
  
  useEffect( () => {
    async function fetchData() {
      const { labels, data, backgroundColor } = await getData()
      const staticData = {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor,
            borderWidth: 1,
          },
        ],
      }
      setData(staticData)
    }
    fetchData()
 
  }, [])

  return (
    <div>
      <h1>{ title }</h1>
      <div className="card">
        { data && <Pie data={data} />}    
      </div>
    </div>
  )
}

export default App
