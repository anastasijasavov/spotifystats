import React from 'react'
import { analyzeSong } from '../../../utils/stats-requests'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


export async function SongAnalysis() {

    const params = useParams();
    useEffect(() => {

        analyzeSong(params.id);

        return () => {

        }
    }, [])


    return (
        <div>SongAnlysis</div>
    )
}
