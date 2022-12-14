import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { Card, Text as TextElement, } from 'react-native-elements'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import StarRating from 'react-native-star-rating'

import styles from './styles'
import { Strings } from '../../Themes/Strings'
import InputFormField from '../../Components/InputFormField'
import FormButton from '../../Components/Button'
import RestActions from '../../Redux/RestaurantRedux'
import { errorMessage } from '../../Lib/utils'
import { reviewRestaurantValidationSchema } from '../../Services/ValidationSchema/ReviewRestaurantValidationSchema'
import { replyReviewValidationSchema } from '../../Services/ValidationSchema/ReplyReviewValidationSchema'
import { Colors } from '../../Themes'
import ReviewItem from '../../Components/ReviewItem'

function CommentsReplyScreen (props) {
  const { review = {}, isAdmin = false, navigation } = props?.route?.params ?? {}

  useEffect(() => {
    if (isAdmin) {
      navigation?.setOptions({
        headerTitle: Strings.updateReview,
      })
    }
  }, [])

  const reviewInfo = review || {}

  const [rating, setRating] = useState(reviewInfo?.rating)

  function onUpdateReview (values) {
    const data = {
      ...values,
      rating,
    }
    props?.onUpdateReview(data, review?.restaurant?._id, review?._id)
  }

  function renderReviewUpdate () {
    return (
      <Formik
        validationSchema={reviewRestaurantValidationSchema}
        initialValues={{
          comment: reviewInfo?.comment ?? '',
          dateOfVisit: reviewInfo?.dateOfVisit ?? '',
        }}
        onSubmit={onUpdateReview}>
        {({
          handleSubmit,
          values,
          errors,
          handleChange,
          handleBlur,
          touched,
        }) => (
          <View style={styles.reviewContainer}>
            <TextElement style={styles.commentHeading} h4>
              {Strings.updateReview}
            </TextElement>
            <View style={styles.ratingContainer}>
              <StarRating
                maxStars={5}
                rating={rating}
                halfStarColor={Colors.golden}
                fullStarColor={Colors.golden}
                selectedStar={startingValue => setRating(startingValue)}
              />
            </View>
            <InputFormField
              label={Strings.comment}
              placeholder={Strings.enterYourComment}
              selectedOption={values?.comment ?? ''}
              onSelect={handleChange('comment')}
              onBlur={handleBlur('comment')}
              returnKeyType={'done'}
              inputContainerStyle={styles.containerInputStyle}
              multiline
            />
            {errorMessage(errors?.comment, touched.comment)}

            <View style={styles.visitDateContainer}>
              <Text style={styles.visitDateTitle}>{Strings.visitDate}</Text>
              <InputFormField
                inputContainerStyle={styles.dateInputContainer}
                label={Strings.visitDate}
                placeholder={Strings.selectDate}
                selectedOption={values?.dateOfVisit ?? ''}
                onSelect={handleChange('dateOfVisit')}
                onBlur={handleBlur('dateOfVisit')}
                dateTime
              />
              {errorMessage(errors?.dateOfVisit, touched.dateOfVisit)}
            </View>
            <FormButton
              title={Strings.updateReview}
              loading={props?.loading}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    )
  }

  function renderCommentReply () {
    return (
      <Formik
        validationSchema={replyReviewValidationSchema}
        initialValues={{
          reply: '',
        }}
        onSubmit={data => props?.onReviewReply(data, review?.restaurant?._id, review?._id)}>
        {({
          handleSubmit,
          values,
          errors,
          handleChange,
          handleBlur,
          touched,
        }) => (
          <View>
            <TextElement h4 style={styles.h4Style}>
              {Strings.leaveAReply}
            </TextElement>
            <View>
              <InputFormField
                label={Strings.reply}
                placeholder={Strings.enterReply}
                selectedOption={values?.reply ?? ''}
                onSelect={handleChange('reply')}
                onBlur={handleBlur('reply')}
                returnKeyType={'done'}
                inputContainerStyle={styles.containerInputStyle}
                multiline
              />
              {errorMessage(errors?.reply, touched.reply)}

              <FormButton
                loading={props?.replying}
                title={Strings.reply}
                onPress={handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card containerStyle={styles.cardContainer}>
          {!isAdmin && (
            <ReviewItem heading={Strings.userReview}
                        item={review}
                        disableRightActions
                        key={Strings.userReview}/>
          )}
          <Card.Divider/>
          {isAdmin ? renderReviewUpdate() : renderCommentReply()}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const mapDispatchToProps = dispatch => ({
  onReviewReply: (data, restaurantId, reviewId) =>
    dispatch(RestActions.reviewReply(data, restaurantId, reviewId)),
  onUpdateReview: (data, restaurantId, reviewId) =>
    dispatch(RestActions.updateReview(data, restaurantId, reviewId)),
})

const mapStateToProps = ({ restaurants: { replying } = {} }) => ({
  replying,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsReplyScreen)
