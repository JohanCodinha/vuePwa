import Vue from 'vue';
import Router from 'vue-router';
import draftObservations from '@/views/draftObservations/index';
import imgagePicker from '@/views/components/imagePicker';
import speciePicker from '@/views/components/speciePicker';
import generalObservation from '@/views/components/generalObservation';
import locationPicker from '@/views/components/locationPicker';
import survey from '@/views/survey/survey';
import signin from '@/views/signin/index';
import observationsList from '@/views/observations/index';
import around from '@/views/around/index';
import speciesDetails from '@/views/speciesDetails/index';
import imageSlideshow from '@/views/imageSlideshow/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: signin,
    },
    {
      path: '/',
      redirect: '/observations',
    },
    {
      path: '/img/slideshow/:observationId',
      name: 'imageSlideshow',
      component: imageSlideshow,
      props: true,
    },
    {
      path: '/img/:observationId',
      name: 'ImagePicker',
      component: imgagePicker,
    },
    {
      path: '/search/:observationId',
      name: 'SpeciePicker',
      component: speciePicker,
      props: true,
    },
    {
      path: '/location/:observationId',
      name: 'LocationPicker',
      component: locationPicker,
      props: true,
    },
    {
      path: '/generalObs/:observationId?',
      name: 'GeneralObs',
      component: generalObservation,
      props: true,
    },
    {
      path: '/survey/:surveyId',
      name: 'survey',
      component: survey,
      props: true,
    },
    {
      path: '/observations',
      name: 'observations',
      component: observationsList,
    },
    {
      path: '/observations/drafts',
      name: 'draftObservations',
      component: draftObservations,
    },
    {
      path: '/explore',
      name: 'exploreAround',
      component: around,
    },
    {
      path: '/explore/species/:taxonId',
      name: 'speciesDetails',
      component: speciesDetails,
      props: true,
    },
  ],
});
