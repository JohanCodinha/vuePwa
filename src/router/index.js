import Vue from 'vue';
import Router from 'vue-router';
import draftObservations from '@/views/draftObservations/index';
import imgagePicker from '@/views/editGeneralObs/imagePicker';
import speciePicker from '@/views/editGeneralObs/speciePicker';
import generalObservation from '@/views/editGeneralObs/generalObservation';
import locationPicker from '@/views/components/locationPicker';
import survey from '@/views/survey/survey';
import signin from '@/views/signin/index';
import observationsList from '@/views/observations/index';
import around from '@/views/around/index';
import speciesDetails from '@/views/speciesDetails/index';
import imageSlideshow from '@/views/imageSlideshow/index';
import aboutPage from '@/views/about/index';
import record from '@/views/record/index';

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
      redirect: '/about',
    },
    {
      path: '/about',
      name: 'aboutPage',
      component: aboutPage,
    },
    {
      path: '/img/slideshow/:observationId/:imageId',
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
      path: '/record/:surveyId',
      name: 'record',
      component: record,
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
    // catch all redirect
    { path: '*', redirect: '/about' }
  ],
});
